
module.exports ={
    HTML : function(body, authStatusUI = '<li class="nav-item" ><a class="nav-link" href="/u/login">로그인</a></li> <li class="nav-item" ><a class="nav-link" href="/u/register">회원가입</a></li>'){
      return ` 
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
        
        <title>school plant</title>
        <style>
      
        </style>
      </head>
      <body>
        <nav class="navbar navbar-expand-md navbar-dark bg-success" style="border-bottom: solid #dbdbdb 1px; backgound-color: #e3f2fd;">
          <div class="container">
            <a class="navbar-brand" href="/o">school plant</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link" href="/o">식물관찰 <span class="sr-only">(current)</span> </a>
                </li>
                <li class="nav-item" >
                  <a class="nav-link" href="/o">학교</a>
                </li>
                <li class="nav-item" >
                  <a class="nav-link" href="/map">지도</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/o/create">사진올리기</a>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    더보기
                  </a>
                  <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" href="/o">내정보</a>
                    <a class="dropdown-item" href="/o">Another action</a>
                    <a class="dropdown-item" href="/o">Something else here</a>
                  </div>
                  <li class="nav-item" >
                   ${authStatusUI}
                  </li>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      <section style="background-color: #f8f9fa; padding-top : 30px;">
        <div class="container">
          ${body}
        </div>
      </section>
        <!-- 여기는 bootstrap-->
        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
      </body>
      </html>
    `;
    },
    create :  `
    <form action = "/o/create_process" method = "post" enctype="multipart/form-data">
      <input type="text" name="o_name" placeholder="자유이름" required>
      <div class=upload_picture>
        <input type="file" name="o_image" files multiple required >
      </div>
      <span class = upload_time>
        <label for="o_time">관찰시간: </label>
        <input  name ="o_time" type="datetime-local" required>
      </span>
      <span class = upload_location>
        (관찰위치 구현): ㅁㅁ
      </span>
      <div class = upload_memo> 
      <label for="o_memo">관찰메모: </label>
      <textarea id="o_memo" name="o_memo" placeholder="관찰한 내용을 입력하세요."></textarea>
      </div>
      <input type="submit" value = "올리기">
    </form>
  `
}