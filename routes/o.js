var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer  = require('multer')
var template = require('../lib/template.js');
var fs = require('fs');
var db = require('../lib/db');

//멀터 설정 어디에 사진파일을 저장할지
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    cb(null,Date.now() + '_' + file.originalname)
  }
})
var upload = multer({ storage: _storage })


// 기본템플릿
var template = require('../lib/template.js');
var auth = require('../lib/auth');


// 카드 및 첫화면
router.get('/', (req, res) => {
    db.query('SELECT * FROM topic', function(err, result){
      function cardList(id,title,description,imagePath){
          return `
              <div class="col">
                <a href="/o/${id}">
                  <div class="card" style="width: 15rem; margin-top: 20px;" >
                    <img src="../${imagePath}" class="card-img-top" style= 'height:250px; ' alt="card image cap">
                      <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${description}</p>
                      </div>
                  </div>
                </a>
              </div>
        `;
        }
      var card_list = '<div class="row">';
        var i = 0;
        while(i < result.length){
          var o_id = result[i].id;
          var imagePath =result[i].o_image_1;
          var card_o_name = result[i].o_name;
          var description = result[i].description;
          card_list = card_list + cardList(o_id, card_o_name,description,imagePath);
          i = i + 1;
        }
        var card_list = card_list + '</div>';
        var html = template.HTML(card_list, auth.StatusUI(req, res));
        res.send(html);
    });
  });

//생성
router.get('/create', (req,res)=>{

  // if(!auth.IsOwner(req,res)){
  //   res.redirect('/o/notice');
  //   return false;
  // }
  const html = template.HTML(template.create,auth.StatusUI(req, res));
  res.send(html);
});

//사진업로드시 아이디 만들어라
router.get('/notice', (req,res) => {
    const html = template.HTML('<a href="/o">사진을 올리려면 로그인해주세요.</a>');
    res.send(html);
})


//생성_과정
router.post('/create_process', upload.array('o_image', 5), function (req, res, next) {
  var images = []
  for(i=0; i < req.files.length; i++){
    images.push(req.files[i].path.slice(7))
  }
  db.query('INSERT INTO topic (o_name, description, created, o_image_1, o_image_2, o_image_3, o_image_4, o_image_5, user_id) VALUES (?, ?, ?, ?, ?, ? , ? , ?, ?)',
  [req.body.o_name, req.body.o_memo, req.body.o_time, images[0], images[1], images[2], images[3], images[4], req.user.id],function(err, result){
    if(err)throw err;
  })

  res.redirect('/o');
})



//  글 수정하기
router.post('/update/:pageId', (req, res) => {
  var pageId = req.params.pageId;
  db.query('SELECT * FROM topic WHERE id=?', [pageId],function(err, result){
      var html =template.HTML(`
      <form action = "/o/update_process" method = "post">
      <div class=search_filter>
        <input type="hidden" name="topic_id" value="${result[0].id}">
        <input type="hidden" name="user_id" value="${result[0].user_id}">
        <span class=search_plant> (식물 이름 선택 필터)</span>
        <sapn class=search_habitat> (서식지 선택 필터)</span>
        <label for="freeName">자유이름: </label>
        <input type="text" id="freeName" name="o_name" placeholder="자유이름" value="${result[0].o_name}" required>
      </div>
      <div class=upload>
        <div class=upload_picture>
        <label for="picture">사진: 이부분은 구현이 안되어있음 이미지 임시저장 및 프론트엔드 작업필요</label>
        <input type="file" id="picture" name="picture" value = "이부분은 현재 구현이 안되어 있습니다.이미지 임시저장이 필요합니다.">
        </div>
        <span class = upload_time>
          <label for="observeTime">관찰시간: </label>
          <input id="observeTime" name ="created" type="datetime-local" value = "${result[0].created}" required>
        </span>
        <span class = upload_location>
          (관찰위치 구현): ㅁㅁ
          <label for="private">비공개</label>
          <input id = "private" name = "private "type="checkbox">
        </span>
      </div>
      <div class = upload_memo> 
      <label for="observeMemo">관찰메모: </label>
      <textarea id="observeMemo" name="description" placeholder="관찰한 내용을 입력하세요.">${result[0].description}</textarea>
      </div>
            <input type="submit" value = "수정하기">
      </form>
      <form action = "/o/delete" method = "post">
        <input type = "hidden" name = "o_id"  value = "${pageId}">
        <input type = "submit" value ="삭제하기">
      </form>

      `,auth.StatusUI(req, res)
      );
      res.send(html);
    });
  })

  // 글 수정하기 process
  router.post('/update_process', (req, res) => {
    var post = req.body;
    var o_name = post.o_name;
    var created = post.created;
    var description = post.description;
    var topic_id = post.topic_id
    db.query('UPDATE topic SET o_name = ? , description = ?,  created = ? WHERE id = ?', [o_name, description, created, topic_id], (err, result) =>{
      if(err)throw err;
      res.redirect(`/o/${topic_id}`);
    })
  });

// 글 삭제하기
router.post('/delete', (req, res) => {
  db.query('SELECT * FROM topic WHERE id = ?',[req.body.o_id],function(err, result){
    if(err)throw err;
    var imageNum = Object.keys(result[0]).length;
    var imageArray = Object.values(result[0])
    for(var i = 4; i < imageNum-1; i ++){
      if(imageArray[i] === null){
        break;
      }
      fs.unlinkSync(`public/${imageArray[i]}`)
      }
    db.query('DELETE FROM topic WHERE id = ?',[req.body.o_id]),function(err, result){
      if(err)throw err;
    }
  });
    res.redirect('/o');
});


// 상세보기
router.get('/:pageId' , (req, res) => {
  var pageId = req.params.pageId;
  db.query('SELECT * FROM topic LEFT JOIN user ON topic.user_id = user.id WHERE topic.id = ?',[pageId],function(err, result){
    var str = ""
    var imageNum = Object.keys(result[0]).length ;
    var imageArray = Object.values(result[0])
    for(var i = 5; i < imageNum; i ++){
      if(imageArray[i] === null){
        break;
      }
      var str = str + '<div class="carousel-item"' + '>' +
      '<img src="../'+ imageArray[i]  +'" class="d-block w-100" alt="'+ i + '"' + '>' + 
      `</div>`
    }
      var html = template.HTML(`
      <div class = "row">
        <div class = "col">
          <div id="carouselInterval" class="carousel slide" data-ride="carousel"   >
            <div class="carousel-inner" style=" width:100%; height: 500px !important;">
            <div class="carousel-item active"  >
              <img src="../${result[0].o_image_1}" class="d-block w-100" alt="1">
            </div>
            ${str}
          </div>
          <a class="carousel-control-prev" href="#carouselInterval" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#carouselInterval" role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
          </a>
          </div>
        </div>
        <div class ="col">
          <h1>${result[0].o_name}</h1>
          <p>${result[0].description}</p>
          <p>${result[0].created}</p>
          <p>by ${result[0].displayName}</p>
          <form action = "/o/update/${pageId}" method = "post">
            <input type = "hidden" name = "o_id"  value = "${pageId}">
            <input type = "${auth.updateHide(req,result)}" value ="수정하기">
          </form>
        </div>
      </div>
    `,auth.StatusUI(req, res));
    res.send(html);
    });
  });

  module.exports = router;