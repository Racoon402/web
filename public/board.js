document.addEventListener("DOMContentLoaded", function () {
    var listItems = document.querySelectorAll('.list-group-item');
    var navItems = document.querySelectorAll('.page-item');

    listItems.forEach(function (item) {
        item.addEventListener("click", function (event) {
            // 기존에 활성화된 요소의 클래스를 제거
            listItems.forEach(function (otherItem) {
                otherItem.classList.remove('active');
            });

            // 클릭한 요소에 활성화 클래스 추가
            event.currentTarget.classList.add('active');
        });
    });

    navItems.forEach(function (item) {
        item.addEventListener("click", function (event) {
            // 기존에 활성화된 요소의 클래스를 제거
            navItems.forEach(function (otherItem) {
                otherItem.classList.remove('active');
            });

            // 클릭한 요소에 활성화 클래스 추가
            event.currentTarget.classList.add('active');
        });
    });
});

function appendDataToTable(data) {
    const tableBody = document.getElementById('board-data');
    data.forEach(row => {
        const newRow = document.createElement('tr');
        newRow.className = 'borad-line';

        newRow.innerHTML = `
            <td>${row.number}</td>
            <td><a href="#">${row.title}</a></td>
            <td>${row.author}</td>
            <td>${row.date}</td>
        `;

        tableBody.appendChild(newRow);
    });
}

// 서버에서 데이터 가져오기
fetch('/board_free')  // 이 부분은 서버에서 데이터를 가져오는 엔드포인트로 변경해야 합니다.
    .then(response => response.json())
    .then(data => {
        appendDataToTable(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });