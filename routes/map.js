var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
const auth = require('../lib/auth');
// 지도
router.get('/', (req,res) => {
    html = template.HTML(`
    <div class ='row'>
      <div class = 'col-12'
        <div id="map" style="width:100%; height:600px;"></div>
      </div>
      <div class ='col-12'>
        <h1>안녕안녕ㅎㅎ</h1>
      </div>
    </div>
    
      <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=a7fd34e10758c080bae3559c743126f9"></script>
      <script>
          var container = document.getElementById('map');
          var options = {
              center: new kakao.maps.LatLng(33.450701, 126.570667),
              level: 3
          };
  
          var map = new kakao.maps.Map(container, options);
    </script>`
    , auth.StatusUI(req, res))
    res.send(html);
  })

module.exports = router;