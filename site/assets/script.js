function updateLunarDate(date) {
  const currentDate = new Date(date);
  const lunarDate = Lunar.fromDate(currentDate);
  const day = lunarDate.toString();
  const week = lunarDate.getWeekInChinese();
  const gz = lunarDate.getYearInGanZhi();
  const sx = lunarDate.getYearShengXiao()
  const fest = lunarDate.getFestivals();
  const jieqi = lunarDate.getJie();
  document.getElementById("dateInfo").innerText = `${day} ${week} ${gz}${sx}年 ${jieqi} ${fest}`.trim();
}

function updatePage(date) {
  updateLunarDate(date);
  const randomNumber = Math.random();
  // console.log(randomNumber, new Date() < new Date(date));
  if (randomNumber >= 0.5 || new Date() < new Date(date)) {
    document.getElementById('calendar-owspace').style.display = '';
    document.getElementById('calendar-one').style.display = 'none';
    updateOwspaceImage(date)
  } else {
    document.getElementById('calendar-owspace').style.display = 'none';
    document.getElementById('calendar-one').style.display = '';
    updateOneImage(date)
  }
}


function updateOwspaceImage(date) {
  const calendarImage = document.querySelector('.calendar');
  const [year, month, day] = date.split('-');
  const base = 'https://img.owspace.com/Public/uploads/Download';
  calendarImage.src = `${base}/${year}/${month}${day}.jpg`;
}

function updateOneImage(date) {
  const url = `http://v3.wufazhuce.com:8000/api/hp/bydate/${date}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayOneData(data['data']);
    })
    .catch(error => {
      console.error('请求出错：', error);
    });
}

function displayOneData(data) {
  const img_url = data['img_url'];
  const cite = data['forward'];
  const title = data['title'];
  const volume = data['volume'];
  const post_date = data['post_date'];
  const pd = new Date(post_date);

  const year = pd.getFullYear();
  const month = pd.toLocaleString('default', { month: 'short' });
  const day = pd.getDate();

  const fp = document.querySelector('.fp-one');
  fp.querySelector('.fp-one-imagen').src = img_url;
  fp.querySelector('.fp-one-imagen-footer').innerText = title;
  fp.querySelector('.fp-one-titulo-pubdate .titulo').innerText = volume;
  fp.querySelector('.fp-one-titulo-pubdate .dom').innerText = `${day}`;
  fp.querySelector('.fp-one-titulo-pubdate .may').innerText = `${month} ${year}`;
  fp.querySelector('.fp-one-cita').innerText = cite;
}

function dateUpdate(delta) {
  const currentDate = new Date(datePicker.value);
  currentDate.setDate(currentDate.getDate() + delta);
  datePicker.value = currentDate.toISOString().split("T")[0];
  document.getElementById('today').innerText = datePicker.value;
  updatePage(datePicker.value);
}
document.addEventListener('DOMContentLoaded', function () {
  const datePicker = document.getElementById('datePicker');
  datePicker.value = new Date().toISOString().split("T")[0];
  document.getElementById('today').innerText = datePicker.value;
  document.getElementById('nextDay').addEventListener('click', () => dateUpdate(1));
  document.getElementById('prevDay').addEventListener('click', () => dateUpdate(-1));

  datePicker.addEventListener('change', function () {
    document.getElementById('today').innerText = this.value;
    updatePage(this.value);
  });
  updatePage(datePicker.value);
});