(async function(K) {
    const page = document.getElementById("page");
    const session = K.session.get() || {};
    page.innerHTML = '<div class="panel panel-body">Đang tải hóa đơn…</div>';

    let student, invoices;
    try {
        const results = await Promise.all(["sinhVien", "hoaDon"].map(r => K.api.list(r)));
        student = results[0].find(s => s.mssv === session.mssv);
        if (!student) throw new Error("Không tìm thấy hồ sơ sinh viên của tài khoản này.");
        invoices = results[1].filter(h => student.phongDangOid && h.phongId === student.phongDangOid)
            .map(h => ({ ...h, tong: (Number(h.tienPhong) || 0) + (Number(h.tienDien) || 0) + (Number(h.tienNuoc) || 0) + (Number(h.dichVu) || 0) }));
    } catch (err) {
        page.innerHTML = `<div class="alert-k bad"><i class="bi bi-exclamation-octagon"></i><div>${K.esc(err.message)}</div></div>`;
        return;
    }

    const statusPill = status => status === "Đã thanh toán" ? '<span class="pill ok">Đã thanh toán</span>' : status === "Quá hạn" ? '<span class="pill bad">Quá hạn</span>' : '<span class="pill warn">Chưa thanh toán</span>';
    page.innerHTML = `
  <div class="page-head"><div><h1>Hóa đơn & thanh toán</h1><p>Hóa đơn gắn với phòng đang lưu trú của bạn.</p></div></div>
  <div class="stat-strip" data-stats></div>
  <div class="alert-k info mb-4"><i class="bi bi-info-circle"></i><div>Đây là bản demo dùng dữ liệu trên trình duyệt; không kết nối ngân hàng và không thực hiện giao dịch tiền thật.</div></div>
  <div class="panel"><div class="toolbar"><div class="input-icon grow"><i class="bi bi-search"></i><input class="form-control" type="search" data-query placeholder="Tìm mã hóa đơn hoặc kỳ thanh toán"></div><select class="form-select" data-status aria-label="Lọc trạng thái"><option value="">Mọi trạng thái</option><option>Chưa thanh toán</option><option>Quá hạn</option><option>Đã thanh toán</option></select></div>
    <div class="table-wrap"><table class="table table-k"><thead><tr><th>Mã / kỳ</th><th>Phòng</th><th class="text-end">Tổng cộng</th><th>Hạn thanh toán</th><th>Trạng thái</th><th></th></tr></thead><tbody data-rows></tbody></table></div>
  </div>`;
    const modal = K.modal("svInvoice", "Chi tiết hóa đơn", '<div data-detail></div>', "");
    function draw() {
        const query = K.norm(page.querySelector("[data-query]").value);
        const status = page.querySelector("[data-status]").value;
        const visible = invoices.filter(h => (!status || h.trangThai === status) && (!query || K.norm(`${h.hoaDonId} ${h.thang} ${h.phongId}`).includes(query)))
            .sort((a, b) => String(b.thang).localeCompare(String(a.thang), "vi", { numeric: true }));
        const outstanding = invoices.filter(h => h.trangThai !== "Đã thanh toán");
        page.querySelector("[data-stats]").innerHTML = `${K.stat("c-blue", "bi-receipt", "Tổng hóa đơn", invoices.length)}${K.stat("c-warn", "bi-hourglass", "Cần thanh toán", outstanding.length, K.money(outstanding.reduce((sum, h) => sum + h.tong, 0)))}${K.stat("c-ok", "bi-check2-circle", "Đã thanh toán", invoices.filter(h => h.trangThai === "Đã thanh toán").length)}`;
        page.querySelector("[data-rows]").innerHTML = !student.phongDangOid ? '<tr><td colspan="6"><div class="empty"><i class="bi bi-receipt"></i><b>Bạn chưa có hóa đơn</b>Hóa đơn sẽ xuất hiện khi bạn được xếp phòng.</div></td></tr>' : visible.length ? visible.map(h => `<tr><td><span class="id-chip">${K.esc(h.hoaDonId)}</span><div class="muted">${K.esc(h.thang)}</div></td><td><span class="id-chip">${K.esc(h.phongId)}</span></td><td class="text-end num"><b>${K.money(h.tong)}</b></td><td>${K.date(h.hanThanhToan)}</td><td>${statusPill(h.trangThai)}</td><td class="actions">${h.trangThai !== "Đã thanh toán" ? `<button class="btn btn-sm btn-ghost" data-pay="${K.esc(h.hoaDonId)}">Ghi nhận đã chuyển</button>` : ""}<button class="btn-icon" data-view="${K.esc(h.hoaDonId)}" aria-label="Xem hóa đơn"><i class="bi bi-eye"></i></button></td></tr>`).join("") : '<tr><td colspan="6"><div class="empty"><i class="bi bi-inbox"></i><b>Không có hóa đơn phù hợp</b></div></td></tr>';
    }
    draw();
    page.addEventListener("input", e => { if (e.target.matches("[data-query]")) draw(); });
    page.addEventListener("change", e => { if (e.target.matches("[data-status]")) draw(); });
    page.addEventListener("click", async e => {
        const view = e.target.closest("[data-view]");
        if (view) {
            const h = invoices.find(x => x.hoaDonId === view.dataset.view);
            if (!h) return;
            modal.title.textContent = `Hóa đơn ${h.hoaDonId} · ${h.thang}`;
            modal.el.querySelector("[data-detail]").innerHTML = `<div class="mb-3">${statusPill(h.trangThai)} <span class="small text-ink3 ms-2">Hạn ${K.date(h.hanThanhToan)}</span></div><table class="table mb-0 num">${[["Tiền phòng", h.tienPhong], ["Tiền điện", h.tienDien], ["Tiền nước", h.tienNuoc], ["Dịch vụ", h.dichVu]].map(([label, amount]) => `<tr><td>${label}</td><td class="text-end">${K.money(amount)}</td></tr>`).join("")}<tr><th>Tổng cộng</th><th class="text-end">${K.money(h.tong)}</th></tr></table>`;
            modal.m.show();
            return;
        }
        const pay = e.target.closest("[data-pay]");
        if (!pay) return;
        const invoice = invoices.find(h => h.hoaDonId === pay.dataset.pay);
        if (!invoice || invoice.trangThai === "Đã thanh toán") return;
        if (!await K.confirm({ title: "Ghi nhận đã chuyển khoản?", body: "Chỉ xác nhận nếu bạn đã thanh toán ngoài hệ thống. Bản demo chỉ đổi trạng thái lưu trong trình duyệt, không gửi hay thu tiền.", okText: "Tôi đã chuyển khoản" })) return;
        pay.disabled = true;
        try {
            await K.api.update("hoaDon", invoice.hoaDonId, { trangThai: "Đã thanh toán" });
            invoice.trangThai = "Đã thanh toán";
            draw();
            K.toast("Đã cập nhật trạng thái hóa đơn trong bản demo.");
        } catch (err) {
            K.toast(err.message, "bad");
            pay.disabled = false;
        }
    });
})(window.KTX);
