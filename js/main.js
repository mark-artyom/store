if (!localStorage.getItem('goods')) {
    localStorage.setItem('goods', JSON.stringify([]))
}
let myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
    keyboard: false
})

let options = {
    valueNames: ['name', 'price']
}

let userList = 

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
                    <td class="price-discount"><input data-goodId="${goods[i][0]}" type="text" value="${goods[i][5]}" min="0" max="100"></td>
                    <td>${goods[i][4]}</td>
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
    document.querySelector('.price-result').innerHTML = resultPrice + ' $'
}

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
            for (i = 0; i < goods.length; i++) {
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