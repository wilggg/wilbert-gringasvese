const track = document.getElementById('carouselTrack');
const dots  = document.querySelectorAll('.dot');
let cur = 0, total = 3;

function goTo(i) {
  cur = (i + total) % total;
  track.style.transform = `translateX(-${cur * 100}%)`;
  dots.forEach(d => d.classList.remove('active'));
  dots[cur].classList.add('active');
}

document.getElementById('prevBtn').addEventListener('click', () => goTo(cur - 1));
document.getElementById('nextBtn').addEventListener('click', () => goTo(cur + 1));
dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.index)));
setInterval(() => goTo(cur + 1), 4500);