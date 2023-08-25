var a=document.querySelector('button');
let plag=0;

a.addEventListener('click',function(){
    var lists = document.querySelector('ul');

    if(plag===0){
        lists.classList.remove('position-absolute');
        plag=1;
    }
    else{
        lists.classList.add('position-absolute');
        plag=0;    
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementsByClassName('loginCheck');

    for (var i = 0; i < loginButton.length; i++) {
        loginButton[i].addEventListener('click', function () {
            // /checklogin 경로로 GET 요청을 보냅니다.
            fetch('/checklogin')
                .then(response => response.json())
                .then(data => {
                    if (data.loggedIn) {
                        // 로그인된 경우
                        window.location.href = '링크 주소'; // 링크로 이동
                    } else {
                        // 로그인되지 않은 경우
                        alert('로그인이 필요합니다.'); // 알림 띄우기
                    }
                })
                .catch(error => {
                    console.error('Error checking login status:', error);
                });
        });
    }

});
