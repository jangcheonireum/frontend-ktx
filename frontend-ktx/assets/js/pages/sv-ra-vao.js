(async function(K) {
    const page = document.getElementById("page");
    const session = K.session.get() || {};
    page.innerHTML = '<div class="panel panel-body">Đang tải lịch sử…</div>';

    try {
        const entries = (await K.api.list("nhatKy")).filter(row => row.mssv === session.mssv)
            .sort((a, b) => b.thoiGian.localeCompare(a.thoiGian));
        const list = K.listPage({
            title: "Lịch sử ra/vào",
            desc: "Các lượt ra và vào được ghi nhận cho tài khoản của bạn.",
            stats: rows => K.stat("c-blue", "bi-clock-history", "Tổng lượt", rows.length) + K.stat("c-ok", "bi-box-arrow-in-right", "Lượt vào", rows.filter(r => r.huong === "Vào").length) + K.stat("c-violet", "bi-box-arrow-right", "Lượt ra", rows.filter(r => r.huong === "Ra").length),
            placeholder: "Tìm camera hoặc mã phòng…",
            search: ["camera", "phongId", "hoTen"],
            filters: [{ id: "direction", label: "Mọi lượt", options: ["Vào", "Ra"], key: "huong" }],
            cols: [
                { h: "Thời gian", sort: "thoiGian", cell: r => `<span title="${K.dateTime(r.thoiGian)}">${K.dateTime(r.thoiGian)}</span>` },
                { h: "Hướng", sort: "huong", cell: r => r.huong === "Vào" ? '<span class="pill ok">Vào KTX</span>' : '<span class="pill blue">Ra khỏi KTX</span>' },
                { h: "Camera", sort: "camera", cell: r => `<span class="id-chip">${K.esc(r.camera)}</span>` },
                { h: "Phòng", sort: "phongId", cell: r => `<span class="id-chip">${K.esc(r.phongId || "—")}</span>` },
                { h: "Độ tin cậy", cls: "text-end num", sort: "doTinCay", cell: r => `${Math.round((Number(r.doTinCay) || 0) * 100)}%` }
            ],
            empty: "Chưa có lượt ra/vào nào được ghi nhận."
        });
        list.setData(entries);
    } catch (err) {
        page.innerHTML = `<div class="alert-k bad"><i class="bi bi-exclamation-octagon"></i><div>${K.esc(err.message)}</div></div>`;
    }
})(window.KTX);
