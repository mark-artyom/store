/* Sorting the table on the left */
table1.onclick = function(e) {
    if (e.target.tagName != 'TH') return
    let th = e.target
    sortTable(th.cellIndex, th.dataset.type, 'table1')
}
/* Sorting the table on the right */
table2.onclick = function(e) {
    if (e.target.tagName != 'TH') return
    let th = e.target
    sortTable(th.cellIndex, th.dataset.type, 'table2')
}

function sortTable(colNum, type, id) {
    let elem = document.getElementById(id)
    let tBody = elem.querySelector('tbody')
    let rowsArray = Array.from(tBody.rows)
    let compare
    switch (type) {
        case 'number':
            compare = function (rowA, rowB) {
                return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
            };
            break;
        case 'string':
            compare = function (rowA, rowB) {
                return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
            };
            break;
        }
        rowsArray.sort(compare)
        tBody.append(...rowsArray)
}

/* Product Search */
let options = {
    valueNames: ['name', 'price']
}

let userList 

/* Add a new product */
// Modal window
let myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
    keyboard: false
})
// Add a counter for the number of products to the local storage
if (!localStorage.getItem('goods')) {
    localStorage.setItem('goods', JSON.stringify([]))
}
// Saving a new product
document.querySelector('button.add-new').addEventListener('click', function(e) {
    let name = document.getElementById('good-name').value
    let price = document.getElementById('good-price').value
    let count = document.getElementById('good-count').value
    if (name && price && count) {
        document.getElementById('good-name').value = ''
        document.getElementById('good-price').value = ''
        document.getElementById('good-count').value = '1'
        let goods = JSON.parse(localStorage.getItem('goods'))
        goods.push(['good-' + goods.length, name, price, count, 0, 0, 0])
        localStorage.setItem('goods', JSON.stringify(goods))
        updateGoods()
        myModal.hide()
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill in all fields"
        })
    }
})
// Updating displayed products
updateGoods()

function updateGoods() {
    let resultPrice = 0
    let tBoby = document.querySelector('.list')
    tBoby.innerHTML = ""
    document.querySelector('.cart').innerHTML = ""
    let goods =JSON.parse(localStorage.getItem('goods'))
    if (goods.length) {
        table1.hidden = false
        table2.hidden = false
        for (let i = 0; i < goods.length; i++) {
            tBoby.insertAdjacentHTML('beforeend',
            `
            <tr class="align-midle">
                <td>${i+1}</td>
                <td class="name">${goods[i][1]}</td>
                <td class="price">${goods[i][2]}</td>
                <td>${goods[i][3]}</td>
                <td><button class="good-delete btn-danger" data-delete = ${goods[i][0]}>&#10006;</button></td>
                <td><button class="good-delete btn-primary" data-goods = ${goods[i][0]}>&#10149;</button></td>
            </tr>
            `
            )
            if (goods[i][4]>0) {
                goods[i][6] = goods[i][4] * goods[i][2] - goods[i][4] * goods[i][2] * goods[i][5] * 0.01
                resultPrice += goods[i][6]
                document.querySelector('.cart').insertAdjacentHTML('beforeend',
                `
                <tr class="align-midle">
                    <td>${i+1}</td>
                    <td class="price-name">${goods[i][1]}</td>
                    <td class="price-one">${goods[i][2]}</td>
                    <td class="price-count">${goods[i][4]}</td>
                    <td class="price-discount"><input data-goodid="${goods[i][0]}" type="text" value="${goods[i][5]}" min="0" max="100"></td>
                    <td>${goods[i][6]}</td>
                    <td><button class="good-delete btn-danger" data-delete = ${goods[i][0]}>&#10006;</button></td>
                </tr>
                `
                )
            }
        }
        userList = new List('goods', options)
    } else {
        table1.hidden = true
        table2.hidden = true
    }
    // // Enter the price in the total
    document.querySelector('.price-result').innerHTML = resultPrice + ' $'
}

/* Removal of individual products */
document.querySelector('.list').addEventListener('click', function(e) {
    if (!e.target.dataset.delete) {
        return
    }
    Swal.fire({
        title: 'Attention!',
        text: 'Do you really want to delete the product?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085D6',
        cancelButtonColor: '#D33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            let goods = JSON.parse(localStorage.getItem('goods'))
            for (let i = 0; i < goods.length; i++) {
                if(goods[i][0] == e.target.dataset.delete) {
                    goods.splice(i, 1)
                    localStorage.setItem('goods', JSON.stringify(goods))
                    updateGoods()
                }
            }
            Swal.fire(
                "Deleted!",
                "The selected product has been deleted.",
                "success"
            )
        }
    })
})

/* Add to Cart */
document.querySelector('.list').addEventListener('click', function(e) {
    if (!e.target.dataset.goods) {
        return
    }
    let goods = JSON.parse(localStorage.getItem('goods'))
    for (let i = 0; i < goods.length; i++) {
        if(goods[i][3] > 0 && goods[i][0] == e.target.dataset.goods) {
            goods[i].splice(3, 1, goods[i][3] - 1)
            goods[i].splice(4, 1, goods[i][4] + 1)
            localStorage.setItem('goods', JSON.stringify(goods))
            updateGoods()
        }
    }
})

/* Removing one item from the shopping cart */
document.querySelector('.cart').addEventListener('click', function(e) {
    if (!e.target.dataset.delete) {
        return
    }
    let goods = JSON.parse(localStorage.getItem('goods'))
    for (let i = 0; i < goods.length; i++) {
        if(goods[i][4] > 0 && goods[i][0] == e.target.dataset.delete) {
            goods[i].splice(3, 1, goods[i][3] + 1)
            goods[i].splice(4, 1, goods[i][4] - 1)
            localStorage.setItem('goods', JSON.stringify(goods))
            updateGoods()
        }
    }
})

/* Changing the discount */
document.querySelector('.cart').addEventListener('input', function(e) {
    if (!e.target.dataset.goodid) {
        return
    }
    let goods = JSON.parse(localStorage.getItem('goods'))
    for (let i = 0; i < goods.length; i++) {
        if(goods[i][0] == e.target.dataset.goodid) {
            // Discount
            goods[i][5] = e.target.value
            // Discounted price
            goods[i][6] = goods[i][4] * goods[i][2] - goods[i][4] * goods[i][2] * goods[i][5] * 0.01
            localStorage.setItem('goods', JSON.stringify(goods))
            updateGoods()
            // Put the focus in the discount field and move the cursor to the end
            let input = document.querySelector(`[data-goodid="${goods[i][0]}"]`)
            input.focus()
            input.selectionStart = input.value.length
        }
    }
})