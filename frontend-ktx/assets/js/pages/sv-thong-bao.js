(async function(K) {
    const page = document.getElementById("page");
    const session = K.session.get() || {};
    page.innerHTML = '<div class="panel panel-body">Đang tải thông báo…</div>';

    let notices;
    try {
        const [allNotices, students, buildings] = await Promise.all(["thongBao", "sinhVien", "toaNha"].map(r => K.api.list(r)));
        const student = students.find(s => s.mssv === session.mssv);
        if (!student) throw new Error("Không tìm thấy hồ sơ sinh viên của tài khoản này.");
        const roomId = student.phongDangOid || "";
        const building = buildings.find(b => b.toaNhaId === roomId.split("-")[0]);
        notices = allNotices.filter(n => {
            const target = K.norm(n.doiTuong);
            if (target.includes("tat ca sinh vien") || target.includes("toan bo sinh vien")) return true;
            if (!building) return false;
            return target.includes(K.norm(building.tenToa)) || target.includes(K.norm("Tòa " + building.toaNhaId));
        }).sort((a, b) => b.ngayGui.localeCompare(a.ngayGui));
    } catch (err) {
        page.innerHTML = `<div class="alert-k bad"><i class="bi bi-exclamation-octagon"></i><div>${K.esc(err.message)}</div></div>`;
        return;
    }

    const styles = {
        "Tài chính": ["violet", "bi-cash-coin"],
        "Bảo trì": ["warn", "bi-tools"],
        "Quan trọng": ["bad", "bi-exclamation-lg"],
        "Sự kiện": ["blue", "bi-calendar-event"],
        "Chung": ["ok", "bi-info-lg"]
    };
    page.innerHTML = `
  <div class="page-head"><div><h1>Thông báo</h1><p>Thông tin chung và thông báo áp dụng cho tòa nhà của bạn.</p></div></div>
  <div class="toolbar"><div class="input-icon grow"><i class="bi bi-search"></i><input class="form-control" type="search" data-query placeholder="Tìm tiêu đề hoặc nội dung"></div><select class="form-select" data-type aria-label="Lọc loại thông báo"><option value="">Mọi loại</option>${Object.keys(styles).map(x => `<option>${K.esc(x)}</option>`).join("")}</select></div>
  <div class="panel"><div class="panel-head"><h3>Thông báo phù hợp</h3><span class="sub ms-auto">${notices.length} thông báo</span></div>
    <ul class="list-k" data-list>${notices.map((n, i) => { const [color, icon] = styles[n.loai] || styles.Chung; return `<li class="align-items-start"><div class="ic ${color}"><i class="bi ${icon}"></i></div><div class="flex-grow-1"><div class="t1">${K.esc(n.tieuDe)}</div><div class="t2">${K.esc(n.doiTuong)} · ${K.dateTime(n.ngayGui)}</div><button class="btn btn-sm btn-ghost mt-2" data-view="${i}">Đọc nội dung</button></div><span class="pill ${color}">${K.esc(n.loai)}</span></li>`; }).join("") || '<li><div class="empty"><i class="bi bi-bell-slash"></i><b>Chưa có thông báo phù hợp</b></div></li>'}</ul>
  </div>`;
    const modal = K.modal("svNotice", "Thông báo", '<div data-detail></div>', "");
    const renderList = () => {
        const query = K.norm(page.querySelector("[data-query]").value);
        const type = page.querySelector("[data-type]").value;
        const filtered = notices.map((n, index) => ({ n, index })).filter(({ n }) => (!type || n.loai === type) && (!query || K.norm(`${n.tieuDe} ${n.noiDung} ${n.doiTuong}`).includes(query)));
        page.querySelector("[data-list]").innerHTML = filtered.map(({ n, index }) => {
            const [color, icon] = styles[n.loai] || styles.Chung;
            return `<li class="align-items-start"><div class="ic ${color}"><i class="bi ${icon}"></i></div><div class="flex-grow-1"><div class="t1">${K.esc(n.tieuDe)}</div><div class="t2">${K.esc(n.doiTuong)} · ${K.dateTime(n.ngayGui)}</div><button class="btn btn-sm btn-ghost mt-2" data-view="${index}">Đọc nội dung</button></div><span class="pill ${color}">${K.esc(n.loai)}</span></li>`;
        }).join("") || '<li><div class="empty"><i class="bi bi-search"></i><b>Không có thông báo phù hợp</b></div></li>';
    };
    page.querySelector("[data-query]").addEventListener("input", renderList);
    page.querySelector("[data-type]").addEventListener("change", renderList);
    page.addEventListener("click", e => {
        const button = e.target.closest("[data-view]");
        if (!button) return;
        const notice = notices[Number(button.dataset.view)];
        if (!notice) return;
        modal.title.textContent = notice.tieuDe;
        modal.el.querySelector("[data-detail]").innerHTML = `<div class="small text-ink3 mb-3">${K.esc(notice.doiTuong)} · ${K.dateTime(notice.ngayGui)}</div><div class="mb-3"><span class="pill ${(styles[notice.loai] || styles.Chung)[0]}">${K.esc(notice.loai)}</span></div><div style="white-space:pre-wrap">${K.esc(notice.noiDung)}</div>`;
        modal.m.show();
    });
})(window.KTX);
