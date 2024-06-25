---
layout: post
title: "I used ChatGPT to Automate Bill.com"
date: 2024-06-01
categories: Business
---

We are processing hundreds of invoices per month with Bill.com, and don't like their automatic billing tool.

```javascript
function moveToNearestMonday() {
    let dateElement = document.querySelector("[name=newBillDueDate]");
    let dateString = dateElement.value;
    let date = new Date(dateString);
    let day = date.getDay();
    
    if (day === 1) {
        console.log("MONDAY!");
    } else {
        // Calculate days to move to the nearest Monday
        let offset = (day === 0 || day === 6) ? (8 - day) % 7 : day - 1;
        
        // Adjust date to the nearest Monday
        date.setDate(date.getDate() - offset);
        
        // Format the date to MM/DD/YYYY
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let dayOfMonth = ('0' + date.getDate()).slice(-2);
        let year = date.getFullYear();
        
        let nearestMonday = `${month}/${dayOfMonth}/${year}`;
        
        // Set the value of the input element to the nearest Monday
        dateElement.value = nearestMonday;
        console.log(`Date changed to nearest Monday: ${nearestMonday}`);
    }
    
    // Check the total amount input value
    let amountElement = document.querySelector('[data-qa="totalAmount"]');
    let amountValue = parseFloat(amountElement.value.replace(/[^0-9.-]+/g,""));
    
    if (amountValue < 0.01) {
        alert("Warning: Amount is zero!");
        window.clearInterval(window.mondayInt)
    }
    
    // Submit the form
    document.getElementById('saveAndNewButton').click();
}

window.mondayInt = setInterval(moveToNearestMonday, 4000);
```
