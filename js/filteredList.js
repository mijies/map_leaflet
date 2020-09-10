// urlでクエリが渡されていれば実行
if(location.search) {

    const facObj = {};
    location.search
    .substr(1)
    .split('&')
    .forEach(item => {
      item.split('=')
        .reduce((fac, item) => {
            if (!facObj[fac]) facObj[fac] = {};
            let value = true;
            if (item.includes('::')) {
                [item, value] = item.split('::');
            }
            facObj[fac][item] = value;
         });
     });

    console.log(facObj)

    const FMGR = new FilterManager(null);
}