(async function(K) {
    const page = document.getElementById("page");
    const session = K.session.get() || {};
    page.innerHTML = '<div class="panel panel-body">Đang tải hồ sơ…</div>';

    let student;
    try {
        const students = await K.api.list("sinhVien");
        student = students.find(s => s.mssv === session.mssv);
        if (!student) throw new Error("Không tìm thấy hồ sơ sinh viên của tài khoản này.");
    } catch (err) {
        page.innerHTML = `<div class="alert-k bad"><i class="bi bi-exclamation-octagon"></i><div>${K.esc(err.message)}</div></div>`;
        return;
    }

    const status = student.trangThai === "Đang lưu trú" ? '<span class="pill ok">Đang lưu trú</span>' : student.trangThai === "Chờ duyệt" ? '<span class="pill warn">Chờ duyệt</span>' : '<span class="pill mute">Đã rời KTX</span>';
    const draw = () => {
        page.innerHTML = `
  <div class="page-head"><div><h1>Hồ sơ cá nhân</h1><p>Thông tin sinh viên đang được lưu trong hồ sơ ký túc xá.</p></div><div class="actions"><button class="btn btn-primary" data-edit><i class="bi bi-pencil"></i>Cập nhật liên hệ</button></div></div>
  <div class="row g-4">
    <div class="col-lg-7"><div class="panel"><div class="panel-head"><h3>Thông tin sinh viên</h3>${status}</div><div class="panel-body">
      <div class="row g-3">
        <div class="col-sm-6"><div class="text-ink3 small">Họ và tên</div><div class="fw-semibold">${K.esc(student.hoTen)}</div></div>
        <div class="col-sm-6"><div class="text-ink3 small">Mã số sinh viên</div><div class="fw-semibold num">${K.esc(student.mssv)}</div></div>
        <div class="col-sm-6"><div class="text-ink3 small">Ngày sinh</div><div>${K.date(student.ngaySinh)}</div></div>
        <div class="col-sm-6"><div class="text-ink3 small">Giới tính</div><div>${K.esc(student.gioiTinh || "—")}</div></div>
        <div class="col-sm-6"><div class="text-ink3 small">Lớp</div><div>${K.esc(student.lop || "—")}</div></div>
        <div class="col-sm-6"><div class="text-ink3 small">Khoa</div><div>${K.esc(student.khoa || "—")}</div></div>
        <div class="col-sm-6"><div class="text-ink3 small">Số điện thoại</div><div data-field="sdt">${K.esc(student.sdt || "—")}</div></div>
        <div class="col-sm-6"><div class="text-ink3 small">Email</div><div data-field="email">${K.esc(student.email || "—")}</div></div>
        <div class="col-sm-6"><div class="text-ink3 small">Quê quán</div><div data-field="queQuan">${K.esc(student.queQuan || "—")}</div></div>
        <div class="col-sm-6"><div class="text-ink3 small">Phòng</div><div>${K.esc(student.phongDangOid || student.phongDangKy || "Chưa được xếp phòng")}</div></div>
      </div>
    </div></div></div>
    <div class="col-lg-5"><div class="panel"><div class="panel-head"><h3>Cập nhật thông tin</h3></div><ul class="list-k">
      <li><div class="ic blue"><i class="bi bi-telephone"></i></div><div><div class="t1">Số điện thoại và email</div><div class="t2">Dùng để Ban quản lý liên hệ khi cần.</div></div></li>
      <li><div class="ic violet"><i class="bi bi-shield-lock"></i></div><div><div class="t1">Thông tin định danh</div><div class="t2">MSSV, họ tên và ngày sinh do Ban quản lý quản lý.</div></div></li>
    </ul></div></div>
  </div>`;
    };
    draw();

    const modal = K.modal("svProfile", "Cập nhật thông tin liên hệ", `<div class="mb-3"><label class="form-label">Số điện thoại<span class="req">*</span></label><input class="form-control" name="sdt" inputmode="tel"></div>
      <div class="mb-3"><label class="form-label">Email</label><input class="form-control" name="email" type="email"></div>
      <div><label class="form-label">Quê quán</label><input class="form-control" name="queQuan" maxlength="100"></div>`, "Lưu thay đổi");
    page.addEventListener("click", e => {
        if (!e.target.closest("[data-edit]")) return;
        modal.form.sdt.value = student.sdt || "";
        modal.form.email.value = student.email || "";
        modal.form.queQuan.value = student.queQuan || "";
        modal.m.show();
    });
    modal.form.addEventListener("submit", async e => {
        e.preventDefault();
        if (!K.validate(modal.form, {
            sdt: v => /^0\d{9}$/.test(v) ? "" : "Số điện thoại gồm 10 chữ số và bắt đầu bằng 0.",
            email: v => !v || /^\S+@\S+\.\S+$/.test(v) ? "" : "Email không hợp lệ.",
            queQuan: v => v.length <= 100 ? "" : "Quê quán tối đa 100 ký tự."
        })) return;
        const button = modal.form.querySelector('[type="submit"]');
        if (button) button.disabled = true;
        try {
            student = await K.api.update("sinhVien", student.mssv, {
                sdt: modal.form.sdt.value.trim(),
                email: modal.form.email.value.trim(),
                queQuan: modal.form.queQuan.value.trim()
            });
            modal.m.hide();
            ["sdt", "email", "queQuan"].forEach(key => {
                const field = page.querySelector(`[data-field="${key}"]`);
                if (field) field.textContent = student[key] || "—";
            });
            K.toast("Đã cập nhật hồ sơ.");
        } catch (err) {
            K.toast(err.message, "bad");
        } finally {
            if (button) button.disabled = false;
        }
    });
})(window.KTX);
