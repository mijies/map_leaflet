
const initializeFilter = () => {
    Array.from(document.getElementsByClassName('filter-ul'), ul => {
        Array.from(ul.children, li => {
            if (li.id) {
                li.addEventListener('click', _ => {
                    if (li.on) {
                        li.on = false;
                        li.classList.remove('cls-filter-on');
                        return;
                    }
                    li.on = true;
                    li.classList.add('cls-filter-on');
                });
            }
        });
    });

    Array.from(FILTER_POPUP_DIV.querySelectorAll("select"), select => {
        addFilterSelectTimeOptions(select)
    });

    document.getElementById('filterApply').addEventListener('click', _ => {
        // 新規園ボタンをオフ
        $('#btnNewSchool').css('background-color', '#f6f6f6');
        document.getElementById("btnNewSchool").enaled = false;

        // メニューがCollapsedで開かれてる場合に隠す
        if (MENU_COLLAPSED && MENU_LIST[0].style.display === "inline-block") {
            MENU_LIST.forEach(list => {
                list.style.display ="none";
            });
        }
    });
};
