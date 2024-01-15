const app = require('./app');

// listen 메서드를 분리함으로서, api 테스트 시행시 실제 서버가 구동되는 상황을 미연에 방지
app.listen(app.get('port'), () => {
    console.log(app.get('port'), 'port is ready');
});
