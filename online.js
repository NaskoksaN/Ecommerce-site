
document.addEventListener('DOMContentLoaded', () => {
    const orderItemsUl = document.getElementById('ordered-items');
    const addButtons = document.querySelectorAll('.add-btn');
    const removeButtons = document.querySelectorAll('.remove-btn');
    const orderBtn = document.getElementById('order-btn');
    const formElement = document.querySelector('.order-form');
    const inputsElement = formElement.querySelectorAll('input');
    const pTotalSumEl = document.getElementById('total-sum');

    const userId='Edfszh8A-729aYYG7';

    const productsObj = {};
    const broughtItems = {};
    const personOrderData=[];

    initialLoadData();

    orderBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        inputsElement.forEach((element)=>{
            const item= element.value;
            personOrderData.push(item)
        });
        inputsElement.forEach((element)=>{
            element.value='';
        });
        let sum = 0.0;
        let orderText = '';
        Object.entries(broughtItems).forEach(product=>{
            const [name, info] = product;
            orderText=orderText.concat(`продукт => ${name} с бройки ${info.count} обща цена${info.tempPrice}\n`)
        });
        orderText=orderText.concat(`данни за доставка => ${personOrderData.join(', ')}`)
        //console.log(orderText);
        emailjs.init(userId);
        let mail = personOrderData[0];
        console.log(mail);
        orderItemsUl.innerHTML='';
        for (let key in broughtItems) {
            if (broughtItems.hasOwnProperty(key)) {
              delete broughtItems[key];
            }
          }
        console.log(broughtItems);
        
        pTotalSumEl.textContent='Сума на поръчката: 0.00 лв.'
        
        sendEmail(mail, orderText);
    });    
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productItem = button.closest('.product-item');
            const productTitle = productItem.querySelector('h2').innerText;

            const price = productsObj[productTitle]?.price || 0;
            let count = 1;

            if (broughtItems[productTitle]) {
                broughtItems[productTitle].count += 1;
                broughtItems[productTitle].tempPrice = broughtItems[productTitle].count * price;


            } else {
                broughtItems[productTitle] = {
                    count: 1,
                    tempPrice: price
                };
            }
            console.log(broughtItems[productTitle].count);
            renderUpdatedList(orderItemsUl, Object.entries(broughtItems).map(([title, info]) => ({
                productTitle: title,
                count: info.count,
                tempPrice: info.tempPrice
            })));
        });
    });
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productItem = button.closest('.product-item');
            const listItems = orderItemsUl.querySelectorAll('li');
            const productTitle = productItem.querySelector('h2').innerText;

            if (!listItems.length) {
                console.log('li is empty');
                return;
            }
            //debugger;
            for (let el of listItems) {
                //const [title, ,] = el.textContent.split(', ');
                if (broughtItems.hasOwnProperty(productTitle)) {

                    const singlePrice = productsObj[productTitle].price;
                    if (broughtItems[productTitle].count > 1) {
                        broughtItems[productTitle].count -= 1;
                        broughtItems[productTitle].tempPrice -= singlePrice;

                    } else {
                        delete broughtItems[productTitle];
                    }
                    renderUpdatedList(orderItemsUl, Object.entries(broughtItems).map(([title, info]) => ({
                        productTitle: title,
                        count: info.count,
                        tempPrice: info.tempPrice
                    })));
                    break;
                }
            }

        });
    });

    function sendEmail(email, textInfo) {
        const orderText = 'Your collected order text here'; 
        
        emailjs.send(userId, 'YOUR_TEMPLATE_ID', {
          to_email: email, // Replace with the recipient's email address
          subject: 'Order Details',
          message: textInfo
        }).then(response => {
          console.log('Email sent successfully:', response);
        }).catch(error => {
          console.error('Failed to send email:', error);
        });
      }

    function initialLoadData() {

        fetch('products.json')
            .then(response => response.json())
            .then(result => {
                const productJson = Object.entries(result);
                const productItems = document.querySelectorAll('.product-item');
                const productList = Object.entries(result);

                productItems.forEach((productItem, index) => {
                    if (index >= productJson.length) return;

                    const [title, info] = productList[index];
                    const productContent = productItem.querySelector('.product-content');
                    productContent.innerHTML = '';

                    productsObj[title] = { price: Number(info.price) };
                    const hEl = document.createElement('h2');
                    const pDescriptionEl = document.createElement('p');
                    const pPriceEl = document.createElement('p');

                    hEl.textContent = title;
                    pDescriptionEl.textContent = `Описание: ${info.description}`;
                    pPriceEl.textContent = `Цена: ${info.price} лв с ДДС`;

                    productContent.appendChild(hEl);
                    productContent.appendChild(pDescriptionEl);
                    productContent.appendChild(pPriceEl);
                });
            })
            .catch(err => console.log(err.message));
    }

    function renderUpdatedList(orderItemsUl, items) {
        orderItemsUl.innerHTML = '';
        let totalSum = 0;
        items.forEach(({ productTitle, count, tempPrice }) => {
            const liEl = createElement(productTitle, count, tempPrice);
            orderItemsUl.appendChild(liEl);
            totalSum += parseFloat(tempPrice);
        });

        updateTotalSum(items);
    }

    function updateTotalSum(items) {
        //const pTotalSumEl = document.getElementById('total-sum');
        totalSum = items.reduce((sum, item) => sum + item.tempPrice, 0);
        pTotalSumEl.textContent = `Сума на поръчката: ${totalSum.toFixed(2)} лв.`;
    }
    function createElement(name, count, price) {
        const pOrder = document.createElement('p');
        pOrder.textContent = `${name}, брой: ${count}, обща сума: ${price.toFixed(2)}`;
        const li = document.createElement('li');
        li.style.listStyle = 'none';
        li.appendChild(pOrder);
        return li;
    }

});