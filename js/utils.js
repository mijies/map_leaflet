
const loadJSON = (data_path, callback) => {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', data_path, true);
    xobj.onreadystatechange = () => {
        if (xobj.readyState === 4 && xobj.status === 200) {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};

const addSelectBoxOptions = (id, optList) => {
    const select = document.getElementById(id);
    optList.forEach(opt => {
        const option = document.createElement("option");
        if (opt.value) option.value = opt.value;
        if (opt.text) option.text = opt.text;
        select.appendChild(option);
    });
};

const htmlTableBuilder = () => {
    var content = '<table><tbody>';
    const fn = (th, td) => {
        content += '<tr>';
        content += `<th>${th}</th>`;
        content += `<td>${td}</td>`;
        content += '</tr>';
    }
    fn.done = () => content += '</tbody></table>';
    return fn;
};

// メニューバーとロゴをWindowサイズに合わせて配置を変更する
const menuResizeHandle = () => {
    const menuDiv = document.getElementById("menu-div");
    const btnDiv = document.getElementById("menu-btn-div");
    const facilityList = document.getElementById("menu-div").querySelector("li");

    const collapseMenu = () => {
        MENU_LIST.forEach(list => {
            list.style.display = "none";
            list.style.width = (window.innerWidth / 3) + "px";
        });
        btnDiv.style.display = "block";
        menuDiv.style.top = (btnDiv.clientHeight - 5) + "px";

        if (window.innerHeight > 580) {
            menuDiv.style.left = (window.innerWidth / 3 * 2 - 5) + "px";
        } else {
            menuDiv.style.left = (window.innerWidth / 3 - 5) + "px";
        }
        MENU_COLLAPSED = true;
    };

    const uncollapseMenu = () => {
        MENU_LIST.forEach(list => {
            list.style.display = "inline-block";
            list.style.width = "";
        });
        menuDiv.style.top = "0px";
        menuDiv.style.left = "50px";
        btnDiv.style.display = "none";

        MENU_COLLAPSED = false;
        if (facilityList.clientHeight > 50) {
            collapseMenu();
        }
    };

    return () => {
         // Windowサイズがメニューの幅より小さい場合(つまりメニューが複数行となる場合)
        if (facilityList.clientHeight > 50 && !MENU_COLLAPSED) {
            collapseMenu();
            return;
        }
        // Windowサイズがメニューの幅より大きい場合
        if (MENU_COLLAPSED) uncollapseMenu();
    };
}
