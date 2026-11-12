(async function(K) {
    const page = document.getElementById("page");
    const session = K.session.get() || {};
    page.innerHTML = '<div class="panel panel-body">Đang tải danh sách phòng…</div>';

    let student, rooms, types, buildings;
    try {
        const results = await Promise.all(["sinhVien", "phong", "loaiPhong", "toaNha"].map(r => K.api.list(r)));
        student = results[0].find(s => s.mssv === session.mssv);
        rooms = results[1];
        types = results[2];
        buildings = results[3];
        if (!student) throw new Error("Không tìm thấy hồ sơ sinh viên của tài khoản này.");
    } catch (err) {
        page.innerHTML = `<div class="alert-k bad"><i class="bi bi-exclamation-octagon"></i><div>${K.esc(err.message)}</div></div>`;
        return;
    }

    const roomType = room => types.find(t => t.loaiPhongId === room.loaiPhongId);
    const building = room => buildings.find(t => t.toaNhaId === room.toaNhaId);
    const compatible = room => {
        const b = building(room);
        return b && b.loaiKhu === student.gioiTinh;
    };
    const capacity = room => (roomType(room) || {}).soNguoiToiDa || 0;
    const available = room => room.trangThai === "Còn trống" && room.soNguoiHienTai < capacity(room) && compatible(room);

    function draw() {
        const selectedBuilding = page.querySelector("[data-building]")?.value || "";
        const choices = rooms.filter(available).filter(r => !selectedBuilding || r.toaNhaId === selectedBuilding);
        page.innerHTML = `
  <div class="page-head"><div><h1>Đăng ký phòng</h1><p>Chọn phòng phù hợp với khu nội trú theo giới tính trong hồ sơ. Đăng ký sẽ chờ Ban quản lý duyệt.</p></div></div>
  ${student.phongDangOid ? `<div class="alert-k info mb-4"><i class="bi bi-house-check"></i><div>Bạn đang ở phòng <b>${K.esc(student.phongDangOid)}</b>. Liên hệ Ban quản lý nếu cần đổi phòng.</div></div>` : ""}
  ${student.phongDangKy ? `<div class="alert-k info mb-4"><i class="bi bi-hourglass-split"></i><div>Nguyện vọng hiện tại: <b>${K.esc(student.phongDangKy)}</b> · đang chờ Ban quản lý duyệt. <button class="btn btn-sm btn-ghost ms-2" data-cancel>Hủy nguyện vọng</button></div></div>` : ""}
  <div class="panel">
    <div class="panel-head"><h3>Phòng còn chỗ</h3><span class="sub ms-auto">${student.phongDangOid ? "Đã có phòng" : choices.length + " phòng phù hợp"}</span></div>
    <div class="toolbar"><select class="form-select" data-building aria-label="Lọc theo tòa"><option value="">Mọi tòa phù hợp</option>${buildings.filter(b => b.loaiKhu === student.gioiTinh).map(b => `<option value="${K.esc(b.toaNhaId)}" ${selectedBuilding === b.toaNhaId ? "selected" : ""}>${K.esc(b.tenToa)}</option>`).join("")}</select></div>
    <div class="panel-body"><div class="row g-3">
      ${student.phongDangOid ? '<div class="col-12"><div class="empty"><i class="bi bi-house-check"></i><b>Bạn đã được xếp phòng</b>Không thể gửi đăng ký mới khi đang có phòng.</div></div>' : choices.length ? choices.map(room => {
          const type = roomType(room) || {}, b = building(room) || {};
          return `<div class="col-md-6 col-xl-4"><div class="panel h-100"><div class="panel-head"><div><h3>${K.esc(room.phongId)}</h3><span class="sub">${K.esc(b.tenToa)} · tầng ${room.tang}</span></div>${K.roomPill(room.trangThai)}</div><div class="panel-body">
            <div class="fw-semibold mb-2">${K.esc(type.tenLoai || "Phòng ở")}</div><div class="d-flex justify-content-between small"><span>Số chỗ</span><b>${room.soNguoiHienTai}/${capacity(room)}</b></div><div class="d-flex justify-content-between small mt-1"><span>Giá tham khảo</span><b>${K.money(type.giaChuan || 0)}/tháng</b></div>
            <div class="mt-3">${(type.tienIch || []).map(x => `<span class="chip">${K.esc(x)}</span>`).join("")}</div>
            <button class="btn btn-primary w-100 mt-3" data-apply="${K.esc(room.phongId)}" ${student.phongDangKy ? "disabled" : ""}>${student.phongDangKy ? "Đã có nguyện vọng" : "Đăng ký phòng này"}</button>
          </div></div></div>`;
      }).join("") : '<div class="col-12"><div class="empty"><i class="bi bi-door-closed"></i><b>Hiện chưa có phòng phù hợp còn chỗ</b>Vui lòng thử lại sau hoặc liên hệ Ban quản lý.</div></div>'}
    </div></div>
  </div>`;
    }
    draw();

    page.addEventListener("change", e => {
        if (e.target.matches("[data-building]")) draw();
    });
    page.addEventListener("click", async e => {
        const apply = e.target.closest("[data-apply]");
        if (apply) {
            const roomId = apply.dataset.apply;
            const room = rooms.find(r => r.phongId === roomId);
            if (!room || !available(room) || student.phongDangOid || student.phongDangKy) {
                K.toast("Phòng không còn phù hợp hoặc hồ sơ đã có đăng ký.", "warn");
                return;
            }
            if (!await K.confirm({ title: "Gửi nguyện vọng phòng?", body: `Bạn muốn đăng ký phòng <b>${K.esc(roomId)}</b>? Nguyện vọng chỉ có hiệu lực sau khi Ban quản lý duyệt.`, okText: "Gửi đăng ký" })) return;
            apply.disabled = true;
            try {
                const currentRoom = await K.api.get("phong", roomId);
                if (!currentRoom || !available(currentRoom)) throw new Error("Phòng vừa hết chỗ. Vui lòng chọn phòng khác.");
                student = await K.api.update("sinhVien", student.mssv, { phongDangKy: roomId, trangThai: "Chờ duyệt" });
                draw();
                K.toast("Đã gửi nguyện vọng. Bạn có thể theo dõi trạng thái tại đây.");
            } catch (err) {
                K.toast(err.message, "bad");
                draw();
            }
            return;
        }
        if (e.target.closest("[data-cancel]")) {
            if (!await K.confirm({ title: "Hủy nguyện vọng?", body: `Nguyện vọng phòng <b>${K.esc(student.phongDangKy)}</b> sẽ bị xóa.`, okText: "Hủy nguyện vọng", danger: true })) return;
            try {
                student = await K.api.update("sinhVien", student.mssv, { phongDangKy: null });
                draw();
                K.toast("Đã hủy nguyện vọng phòng.");
            } catch (err) {
                K.toast(err.message, "bad");
            }
        }
    });
})(window.KTX);
