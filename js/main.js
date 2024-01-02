if (!localStorage.getItem('goods')) {
    localStorage.setItem('goods', JSON.stringify([]))
}
let myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
    keyboard: false
})

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
        //updateGoods()
        myModal.hide()
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill in all fields"
        })
    }
})