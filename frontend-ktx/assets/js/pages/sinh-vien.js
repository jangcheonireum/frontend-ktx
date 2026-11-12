// Hồ sơ sinh viên (US03 – Sprint 2) – giao diện danh sách, lọc, thêm/sửa
(async function(K) {
    const stPill = s => s === "Đang lưu trú" ? `<span class="pill ok">${s}</span>` : s === "Chờ duyệt" ? `<span class="pill warn">${s}</span>` : `<span class="pill mute">${s}</span>`;
    const [svs, initialRooms, toas, lps] = await Promise.all(["sinhVien", "phong", "toaNha", "loaiPhong"].map(r => K.api.list(r)));
    let phongs = initialRooms;
    const capacity = p => (lps.find(l => l.loaiPhongId === p.loaiPhongId) || {}).soNguoiToiDa || 0;
    const toaOf = s => s.phongDangOid ? s.phongDangOid.split("-")[0] : "";
    const L = K.listPage({
        title: "Hồ sơ sinh viên", desc: "Thông tin cá nhân, liên hệ và phòng đang ở của sinh viên nội trú.",
        actions: `<button class="btn btn-ghost" data-csv><i class="bi bi-download"></i>Xuất CSV</button><button class="btn btn-primary" data-add><i class="bi bi-person-plus"></i>Thêm sinh viên</button>`,
        stats: r => K.stat("c-blue", "bi-people", "Tổng hồ sơ", r.length, "sinh viên trong hệ thống") + K.stat("c-ok", "bi-house-check", "Đang lưu trú", r.filter(s => s.trangThai === "Đang lưu trú").length) + K.stat("c-warn", "bi-hourglass-split", "Chờ duyệt", r.filter(s => s.trangThai === "Chờ duyệt").length) + K.stat("c-violet", "bi-person-bounding-box", "Đã đăng ký khuôn mặt", `${r.filter(s => s.faceId).length}<small> / ${r.length}</small>`),
        tabs: { items: [{ v: "", t: "Tất cả" }, { v: "Đang lưu trú", t: "Đang lưu trú" }, { v: "Chờ duyệt", t: "Chờ duyệt" }, { v: "Đã rời KTX", t: "Đã rời KTX" }], match: (r, v) => r.trangThai === v },
        placeholder: "Tìm tên, MSSV, SĐT, phòng…", search: ["hoTen", "mssv", "sdt", "phongDangOid", "phongDangKy", "lop"],
        filters: [{ id: "toa", label: "Mọi tòa", options: toas.map(t => ({ v: t.toaNhaId, t: t.tenToa })), match: (r, v) => toaOf(r) === v }, { id: "gt", label: "Giới tính", options: ["Nam", "Nữ"], key: "gioiTinh" }],
        cols: [
            { h: "Sinh viên", sort: "hoTen", cell: s => K.person(s.hoTen, s.mssv) },
            { h: "Lớp / Khoa", sort: "lop", cell: s => `<div class="cell-2"><b>${K.esc(s.lop)}</b><small>${K.esc(s.khoa)}</small></div>` },
            { h: "Liên hệ", cell: s => `<div class="cell-2"><b class="fw-normal num">${s.sdt}</b><small>${K.esc(s.email)}</small></div>` },
            { h: "Phòng", sort: "phongDangOid", cell: s => s.phongDangOid ? `<span class="id-chip">${s.phongDangOid}</span>` : '<span class="text-ink3">Chưa xếp</span>' },
            { h: "Nguyện vọng", sort: "phongDangKy", cell: s => s.phongDangKy ? `<span class="pill warn">${K.esc(s.phongDangKy)}</span>` : '<span class="text-ink3">—</span>' },
            { h: "Khuôn mặt", cell: s => s.faceId ? '<span class="pill violet">Đã đăng ký</span>' : '<span class="pill mute">Chưa có</span>' },
            { h: "Trạng thái", sort: "trangThai", cell: s => stPill(s.trangThai) },
            { h: "", cls: "actions", cell: s => `<button class="btn-icon" data-edit="${s.mssv}" title="Sửa" aria-label="Sửa ${K.esc(s.hoTen)}"><i class="bi bi-pencil"></i></button><button class="btn-icon danger" data-del="${s.mssv}" title="Xóa" aria-label="Xóa"><i class="bi bi-trash3"></i></button>` }
        ]
    });
    L.setData(svs);

    let emptyRooms = phongs.filter(p => p.trangThai === "Còn trống" && p.soNguoiHienTai < capacity(p));
    const M = K.modal("svM", "Thêm sinh viên", `<div class="row g-3">
    <div class="col-md-8"><label class="form-label">Họ và tên<span class="req">*</span></label><input class="form-control" name="hoTen"></div>
    <div class="col-md-4"><label class="form-label">MSSV<span class="req">*</span></label><input class="form-control" name="mssv" inputmode="numeric"></div>
    <div class="col-md-4"><label class="form-label">Ngày sinh</label><input class="form-control" type="date" name="ngaySinh"></div>
    <div class="col-md-4"><label class="form-label">Giới tính</label><select class="form-select" name="gioiTinh"><option>Nam</option><option>Nữ</option></select></div>
    <div class="col-md-4"><label class="form-label">Lớp</label><input class="form-control" name="lop" placeholder="65K1"></div>
    <div class="col-md-6"><label class="form-label">Số điện thoại<span class="req">*</span></label><input class="form-control" name="sdt" inputmode="tel"></div>
    <div class="col-md-6"><label class="form-label">Email</label><input class="form-control" name="email" type="email"></div>
    <div class="col-md-6"><label class="form-label">Khoa</label><input class="form-control" name="khoa"></div>
    <div class="col-md-6"><label class="form-label">Quê quán</label><input class="form-control" name="queQuan"></div>
    <div class="col-md-6"><label class="form-label">Phòng (chọn nguyện vọng để duyệt)</label><select class="form-select" name="phongDangOid"><option value="">Chưa xếp phòng</option>${emptyRooms.map(p => `<option>${p.phongId}</option>`).join("")}</select><div class="form-text">Lưu hồ sơ với phòng đã chọn sẽ xác nhận sinh viên đang lưu trú.</div></div>
    <div class="col-md-6"><label class="form-label">Ảnh chân dung</label><input class="form-control" type="file" accept="image/*" name="anh"><div class="form-text">Dùng cho đăng ký khuôn mặt (Sprint 2).</div></div>
  </div>`, "Lưu sinh viên", "modal-lg");
    let editing = null;
    async function updateRoomOccupancy(previous, next, persist) {
        const oldRoomId = previous && previous.phongDangOid;
        if (oldRoomId === next) return persist();
        const snapshots = [];
        const adjust = async (roomId, amount, assigning) => {
            const room = await K.api.get("phong", roomId);
            if (!room) throw new Error(`Không tìm thấy phòng ${roomId}.`);
            const max = capacity(room);
            const count = Number(room.soNguoiHienTai) || 0;
            if (assigning && (room.trangThai !== "Còn trống" || !max || count >= max)) throw new Error(`Phòng ${roomId} không còn chỗ trống.`);
            const nextCount = Math.max(0, Math.min(max, count + amount));
            const status = room.trangThai === "Đang bảo trì" ? "Đang bảo trì" : nextCount >= max ? "Đã đầy" : "Còn trống";
            snapshots.push({ phongId: room.phongId, soNguoiHienTai: count, trangThai: room.trangThai });
            await K.api.update("phong", roomId, { soNguoiHienTai: nextCount, trangThai: status });
        };
        try {
            if (next) {
                const targetRoom = await K.api.get("phong", next);
                const targetBuilding = targetRoom && toas.find(t => t.toaNhaId === targetRoom.toaNhaId);
                const student = previous || (editing && L.data.find(s => s.mssv === editing));
                const gender = student ? student.gioiTinh : M.form.gioiTinh.value;
                if (!targetRoom || !targetBuilding || targetBuilding.loaiKhu !== gender) throw new Error("Phòng không phù hợp với giới tính trong hồ sơ.");
                await adjust(next, 1, true);
            }
            if (oldRoomId) await adjust(oldRoomId, -1, false);
            return await persist();
        } catch (err) {
            let rollbackError = null;
            for (const snapshot of snapshots.reverse()) {
                try {
                    await K.api.update("phong", snapshot.phongId, { soNguoiHienTai: snapshot.soNguoiHienTai, trangThai: snapshot.trangThai });
                } catch (rollback) {
                    rollbackError = rollback;
                }
            }
            if (rollbackError) throw new Error(`${err.message} Không thể hoàn tác cập nhật phòng: ${rollbackError.message}`);
            throw err;
        }
    }
    function open(s) {
        editing = s ? s.mssv : null; M.form.reset(); M.title.textContent = s ? "Sửa hồ sơ " + s.hoTen : "Thêm sinh viên";
        M.form.mssv.readOnly = !!s;
        if (s) { ["hoTen", "mssv", "ngaySinh", "gioiTinh", "lop", "sdt", "email", "khoa", "queQuan"].forEach(k => M.form[k].value = s[k] || ""); const room = s.phongDangOid || s.phongDangKy; if (room && ![...M.form.phongDangOid.options].some(o => o.value === room)) M.form.phongDangOid.add(new Option(room + (s.phongDangKy ? " (nguyện vọng)" : " (hiện tại)"), room)); M.form.phongDangOid.value = room || ""; }
        M.m.show();
    }
    M.form.addEventListener("submit", async e => {
        e.preventDefault();
        if (!K.validate(M.form, { hoTen: v => v ? "" : "Nhập họ tên.", mssv: v => !/^\d{8,12}$/.test(v) ? "MSSV gồm 8–12 chữ số." : (!editing && L.data.some(s => s.mssv === v) ? "MSSV đã tồn tại." : ""), sdt: v => /^0\d{9}$/.test(v) ? "" : "SĐT gồm 10 số, bắt đầu bằng 0.", email: v => !v || /^\S+@\S+\.\S+$/.test(v) ? "" : "Email không hợp lệ." })) return;
        const o = {};["hoTen", "mssv", "ngaySinh", "gioiTinh", "lop", "sdt", "email", "khoa", "queQuan", "phongDangOid"].forEach(k => o[k] = M.form[k].value.trim() || null);
        o.trangThai = o.phongDangOid ? "Đang lưu trú" : "Chờ duyệt";
        if (editing && o.phongDangOid) o.phongDangKy = null;
        try {
            const previous = editing && L.data.find(s => s.mssv === editing);
            await updateRoomOccupancy(previous, o.phongDangOid, () => editing ? K.api.update("sinhVien", editing, o) : K.api.create("sinhVien", { ...o, faceId: false }));
            M.m.hide();
            K.toast(editing ? "Đã lưu hồ sơ" : "Đã thêm sinh viên " + o.hoTen);
            L.setData(await K.api.list("sinhVien"));
            phongs = await K.api.list("phong");
            emptyRooms = phongs.filter(p => p.trangThai === "Còn trống" && p.soNguoiHienTai < capacity(p));
            M.form.phongDangOid.innerHTML = `<option value="">Chưa xếp phòng</option>${emptyRooms.map(p => `<option>${K.esc(p.phongId)}</option>`).join("")}`;
        } catch (err) { K.toast(err.message, "bad"); }
    });
    L.page.addEventListener("click", async e => {
        if (e.target.closest("[data-add]")) open(null);
        const ed = e.target.closest("[data-edit]"); if (ed) open(L.data.find(s => s.mssv === ed.dataset.edit));
        const d = e.target.closest("[data-del]");
        if (d && await K.confirm({ title: "Xóa hồ sơ sinh viên?", body: `Hồ sơ <b>${d.dataset.del}</b> và dữ liệu khuôn mặt sẽ bị xóa.`, okText: "Xóa hồ sơ", danger: true })) { await K.api.remove("sinhVien", d.dataset.del); L.setData(await K.api.list("sinhVien")); K.toast("Đã xóa hồ sơ"); }
        if (e.target.closest("[data-csv]")) L.csv("sinh-vien.csv", ["MSSV", "Họ tên", "Giới tính", "Lớp", "Khoa", "SĐT", "Email", "Phòng", "Nguyện vọng", "Trạng thái"], s => [s.mssv, s.hoTen, s.gioiTinh, s.lop, s.khoa, s.sdt, s.email, s.phongDangOid, s.phongDangKy, s.trangThai]);
    });
})(window.KTX);
