
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

const menuListFacilityClickEvent = (li) => {
    li.on = true;
    return () => {
        if (li.on) {
            map.removeLayer(NURSERY_LAYERS[li.id]);
            li.style.color = "grey";
            li.style["background-color"] = "rgba(240,240,240,0.8)";
            li.on = false;
            return;
        }
        map.addLayer(NURSERY_LAYERS[li.id]);
        li.style.color = "white";
        li.style["background-color"] = "";
        li.on = true;
    };
};

const menuListSchoolClickEvent = (li) => {
    li.style.color = "grey";
    li.style["background-color"] = "rgba(240,240,240,0.8)";
    li.on = false;
    return () => {
        if (li.on) {
            map.removeLayer(SCHOOL_LAYERS[li.id]);
            li.style.color = "grey";
            li.style["background-color"] = "rgba(240,240,240,0.8)";
            li.on = false;
            return;
        }
        map.addLayer(SCHOOL_LAYERS[li.id]);
        li.style.color = "";
        li.style["background-color"] = "";
        li.on = true;
    };
};

Object.keys(NURSERY_LAYERS).forEach(key => {
    EVENT_HANDLE[key] = menuListFacilityClickEvent;
});

EVENT_HANDLE.btnElementarySchool = menuListSchoolClickEvent;
EVENT_HANDLE.btnMiddleSchool = menuListSchoolClickEvent;



const addSelectBoxOptions = (id, optList) => {
    const select = document.getElementById(id);
    optList.forEach(opt => {
        const option = document.createElement("option");
        if (opt.value) option.value = opt.value;
        if (opt.text) option.text = opt.text;
        select.appendChild(option);
    });
};

// メニューバーとロゴをWindowサイズに合わせて配置を変更する
const menuResizeHandle = () => {
    // const menuList = document.getElementsByClassName("menu-li");
    // const itemList = Object.values(menuList[0].children).map(child => child);
    // const menuDiv = document.getElementById("menu-div");
    // const btnDiv = document.getElementById("menu-btn-div");
    // const btnList = ["btnFilter", "btnNewSchool", "btnBaseMap", "btnStation", "btnHelp"].map(id => {
    //     return document.getElementById(id);
    // });

    // const thresholdWidth = menuList[0].clientWidth + 50;

    // const collapseMenu = () => {
    //     menuList[0].style.display ="none";
    //     menuList[1].style.display ="none";
    //     btnDiv.style.display = "block";

    //     itemList.forEach(item => {
    //         item.style.width =  (window.innerWidth / 3) + "px";
    //     });
    //     btnList.forEach(btn => {
    //         btn.style.width = (window.innerWidth / 3) + "px";
    //     });

    //     menuDiv.style.top = (btnDiv.clientHeight - 5) + "px";
    //     if (window.innerHeight > 580) {
    //         menuDiv.style.left = (window.innerWidth / 3 * 2 - 5) + "px";
    //     } else {
    //         menuDiv.style.left = (window.innerWidth / 3 - 5) + "px";
    //     }
    // };

    // const uncollapseMenu = () => {
    //     menuDiv.style.top = "0px";
    //     menuDiv.style.left = "50px";

    //     menuList[0].style.display ="inline-block";
    //     menuList[1].style.display ="inline-block";
    //     btnDiv.style.display = "none";

    //     itemList.forEach(item => {
    //         item.style.width = "";
    //     });

    //     btnList.forEach(btn => {
    //         btn.style.width = "";
    //     });
    // };

    // return () => {
    //      // Windowサイズがメニューの幅より小さい場合(つまりメニューが複数行となる場合)
    //     if (thresholdWidth > window.innerWidth) {
    //         collapseMenu();
    //         return;
    //     }
    //     // Windowサイズがメニューの幅より大きい場合
    //     uncollapseMenu();
    // };
}
