(async function(K) {
    const page = document.getElementById("page");
    const session = K.session.get() || {};
    page.innerHTML = '<div class="panel panel-body">Đang tải phản ánh…</div>';

    let student, reports;
    try {
        const [students, allReports] = await Promise.all(["sinhVien", "phanAnh"].map(r => K.api.list(r)));
        student = students.find(s => s.mssv === session.mssv);
        if (!student) throw new Error("Không tìm thấy hồ sơ sinh viên của tài khoản này.");
        reports = allReports.filter(r => r.mssv === student.mssv).sort((a, b) => b.ngayGui.localeCompare(a.ngayGui));
    } catch (err) {
        page.innerHTML = `<div class="alert-k bad"><i class="bi bi-exclamation-octagon"></i><div>${K.esc(err.message)}</div></div>`;
        return;
    }

    const categories = ["Điện", "Nước", "Wifi", "Thiết bị", "Vệ sinh", "Khác"];
    const icons = { "Điện": "bi-lightning", "Nước": "bi-droplet", "Wifi": "bi-wifi", "Thiết bị": "bi-fan", "Vệ sinh": "bi-trash", "Khác": "bi-chat-left-text" };
    const statePill = state => state === "Chờ tiếp nhận" ? '<span class="pill warn">Chờ tiếp nhận</span>' : state === "Đang xử lý" ? '<span class="pill blue">Đang xử lý</span>' : '<span class="pill ok">Đã hoàn thành</span>';
    page.innerHTML = `
  <div class="page-head"><div><h1>Gửi phản ánh</h1><p>Báo cáo sự cố tại phòng hoặc khu vực chung và theo dõi tiến độ xử lý.</p></div></div>
  <div class="row g-4">
    <div class="col-xl-5"><div class="panel"><div class="panel-head"><h3>Phản ánh mới</h3></div><div class="panel-body">
      <form data-form novalidate>
        <div class="mb-3"><label class="form-label">Loại sự cố<span class="req">*</span></label><select class="form-select" name="loai">${categories.map(c => `<option>${K.esc(c)}</option>`).join("")}</select></div>
        <div class="mb-3"><label class="form-label">Mô tả<span class="req">*</span></label><textarea class="form-control" name="noiDung" rows="5" maxlength="1000" placeholder="Mô tả vị trí và tình trạng sự cố…"></textarea><div class="form-text"><span data-count>0</span>/1000 ký tự</div></div>
        <button class="btn btn-primary w-100" type="submit"><i class="bi bi-send"></i>Gửi phản ánh</button>
      </form>
    </div></div></div>
    <div class="col-xl-7"><div class="panel"><div class="panel-head"><h3>Phản ánh của tôi</h3><span class="sub ms-auto" data-total></span></div><ul class="list-k" data-list></ul></div></div>
  </div>`;

    const form = page.querySelector("[data-form]");
    const draw = () => {
        page.querySelector("[data-total]").textContent = `${reports.length} phản ánh`;
        page.querySelector("[data-list]").innerHTML = reports.length ? reports.map(r => {
            const icon = icons[r.loai] || icons["Khác"];
            return `<li class="align-items-start"><div class="ic ${r.trangThai === "Chờ tiếp nhận" ? "warn" : "blue"}"><i class="bi ${icon}"></i></div><div class="flex-grow-1"><div class="t1">${K.esc(r.loai)} · #${K.esc(r.id)}</div><div class="small text-ink2 my-1">${K.esc(r.noiDung)}</div><div class="t2">Phòng ${K.esc(r.phongId || "—")} · ${K.dateTime(r.ngayGui)}</div></div>${statePill(r.trangThai)}</li>`;
        }).join("") : '<li><div class="empty"><i class="bi bi-chat-left-text"></i><b>Bạn chưa gửi phản ánh nào</b></div></li>';
    };
    draw();
    form.noiDung.addEventListener("input", () => { page.querySelector("[data-count]").textContent = form.noiDung.value.length; });
    form.addEventListener("submit", async e => {
        e.preventDefault();
        if (!K.validate(form, {
            loai: v => categories.includes(v) ? "" : "Chọn loại sự cố.",
            noiDung: v => v.length < 10 ? "Mô tả ít nhất 10 ký tự." : v.length > 1000 ? "Mô tả tối đa 1000 ký tự." : ""
        })) return;
        const submit = form.querySelector('[type="submit"]');
        submit.disabled = true;
        try {
            const report = await K.api.create("phanAnh", {
                mssv: student.mssv,
                phongId: student.phongDangOid || null,
                loai: form.loai.value,
                noiDung: form.noiDung.value.trim(),
                ngayGui: new Date().toISOString(),
                trangThai: "Chờ tiếp nhận"
            });
            reports.unshift(report);
            form.reset();
            page.querySelector("[data-count]").textContent = "0";
            draw();
            K.toast("Đã gửi phản ánh đến Ban quản lý.");
        } catch (err) {
            K.toast(err.message, "bad");
        } finally {
            submit.disabled = false;
        }
    });
})(window.KTX);
