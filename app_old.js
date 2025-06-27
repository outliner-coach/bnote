// 메모 데이터는 localStorage에 JSON 포맷으로 저장됩니다.
console.log('JavaScript 파일 로드 시작');

const noteListEl = document.getElementById('note-list');
const noteEditorEl = document.getElementById('note-editor');
const newNoteBtn = document.getElementById('new-note');

console.log('DOM 요소 확인:');
console.log('noteListEl:', noteListEl);
console.log('noteEditorEl:', noteEditorEl);
console.log('newNoteBtn:', newNoteBtn);

// 모달 관련 요소들
const modal = document.getElementById('text-input-modal');
const modalTitle = document.getElementById('modal-title');
const modalLabel = document.getElementById('modal-label');
const modalInput = document.getElementById('modal-input');
const modalOverlay = document.getElementById('modal-overlay');
const modalCancel = document.getElementById('modal-cancel');
const modalConfirm = document.getElementById('modal-confirm');

console.log('모달 요소 확인:');
console.log('modal:', modal);
console.log('modalInput:', modalInput);

// 툴바 요소 확인
const toolbar = document.getElementById('toolbar');
console.log('toolbar:', toolbar);

// 날씨 관련 요소들
const weatherContainer = document.getElementById('weather-container');
const weatherBtn = document.getElementById('weather-btn');

// notes: [{ id: string, content: string, updatedAt: number }]
let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let currentId = null;

console.log('저장된 메모 개수:', notes.length);

// 모달 관련 변수
let modalResolve = null;
let modalReject = null;

// 날씨 관련 변수
let currentWeather = 'none'; // 'none', 'rain', 'snow', 'cloud'
let weatherInterval = null;

// 날씨 효과 함수들
function clearWeather() {
  console.log('날씨 효과 클리어');
  if (weatherContainer) {
    weatherContainer.innerHTML = '';
  }
  if (weatherInterval) {
    clearInterval(weatherInterval);
    weatherInterval = null;
  }
  // 다크 모드 해제
  document.body.classList.remove('night-mode');
}

function createRainDrop() {
  const drop = document.createElement('div');
  drop.className = 'ascii-art rain';
  drop.textContent = '|';
  drop.style.position = 'absolute';
  drop.style.left = Math.random() * 100 + '%';
  drop.style.top = '-20px';
  drop.style.color = '#4a90e2';
  drop.style.fontSize = '14px';
  drop.style.fontFamily = 'Courier New, monospace';
  drop.style.fontWeight = 'bold';
  drop.style.zIndex = '6';
  drop.style.animationDelay = Math.random() * 2 + 's';
  drop.style.animationDuration = (1.5 + Math.random()) + 's';
  console.log('빗방울 생성:', drop);
  return drop;
}

function createSnowFlake() {
  const flake = document.createElement('div');
  flake.className = 'ascii-art snow';
  flake.textContent = '*';
  flake.style.position = 'absolute';
  flake.style.left = Math.random() * 100 + '%';
  flake.style.top = '-20px';
  flake.style.color = '#87ceeb';
  flake.style.fontSize = '16px';
  flake.style.fontFamily = 'Courier New, monospace';
  flake.style.fontWeight = 'bold';
  flake.style.zIndex = '6';
  flake.style.animationDelay = Math.random() * 3 + 's';
  flake.style.animationDuration = (2 + Math.random() * 2) + 's';
  console.log('눈송이 생성:', flake);
  return flake;
}

function createCloud() {
  const cloud = document.createElement('div');
  cloud.className = 'ascii-art cloud';
  cloud.innerHTML = `      .-""""""""""-.
    .'              '.
   /                  \\
  ;                    ;
  |                    |
  |                    |
   \\                  /
    '.              .'
      '-............-'`;
  cloud.style.position = 'absolute';
  cloud.style.left = '-150px'; // 시작 위치를 화면 밖으로
  cloud.style.top = Math.random() * 40 + 10 + 'px';
  cloud.style.color = '#708090';
  cloud.style.fontSize = '8px';
  cloud.style.fontFamily = 'Courier New, monospace';
  cloud.style.fontWeight = 'bold';
  cloud.style.zIndex = '6';
  cloud.style.whiteSpace = 'pre';
  cloud.style.lineHeight = '1';
  console.log('구름 생성:', cloud);
  return cloud;
}

function createStar() {
  const star = document.createElement('div');
  star.className = 'ascii-art star';
  star.textContent = '✦';
  star.style.position = 'absolute';
  star.style.left = Math.random() * 100 + '%';
  star.style.top = Math.random() * 80 + 'px';
  star.style.color = '#fff';
  star.style.fontSize = '10px';
  star.style.fontFamily = 'Courier New, monospace';
  star.style.fontWeight = 'bold';
  star.style.zIndex = '6';
  star.style.animationDelay = Math.random() * 2 + 's';
  star.style.animationDuration = (1.5 + Math.random()) + 's';
  console.log('별 생성:', star);
  return star;
}

function createShootingStar() {
  const shootingStar = document.createElement('div');
  shootingStar.className = 'ascii-art shooting-star';
  shootingStar.textContent = '★';
  shootingStar.style.position = 'absolute';
  shootingStar.style.left = '-50px';
  shootingStar.style.top = Math.random() * 60 + 'px';
  shootingStar.style.color = '#ffd700';
  shootingStar.style.fontSize = '12px';
  shootingStar.style.fontFamily = 'Courier New, monospace';
  shootingStar.style.fontWeight = 'bold';
  shootingStar.style.zIndex = '6';
  shootingStar.style.animationDelay = Math.random() * 3 + 's';
  console.log('별똥별 생성:', shootingStar);
  return shootingStar;
}

function createSunRay() {
  const ray = document.createElement('div');
  ray.className = 'ascii-art sun-ray';
  ray.textContent = '|';
  ray.style.position = 'absolute';
  ray.style.left = Math.random() * 100 + '%';
  ray.style.top = '30px';
  ray.style.color = '#ffd700';
  ray.style.fontSize = '16px';
  ray.style.fontFamily = 'Courier New, monospace';
  ray.style.fontWeight = 'bold';
  ray.style.zIndex = '6';
  ray.style.animationDelay = Math.random() * 4 + 's';
  ray.style.animationDuration = (3 + Math.random()) + 's';
  console.log('햇살 생성:', ray);
  return ray;
}

function createSunbeam() {
  const beam = document.createElement('div');
  beam.className = 'ascii-art sunbeam';
  beam.textContent = '\\';
  beam.style.position = 'absolute';
  beam.style.left = Math.random() * 100 + '%';
  beam.style.top = '5px';
  beam.style.color = '#ffeb3b';
  beam.style.fontSize = '14px';
  beam.style.fontFamily = 'Courier New, monospace';
  beam.style.fontWeight = 'bold';
  beam.style.zIndex = '6';
  beam.style.animationDelay = Math.random() * 4 + 's';
  beam.style.animationDuration = (3 + Math.random()) + 's';
  console.log('햇빛 줄기 생성:', beam);
  return beam;
}

function startRain() {
  console.log('비 효과 시작');
  clearWeather();
  currentWeather = 'rain';
  
  if (!weatherContainer) {
    console.error('weatherContainer를 찾을 수 없습니다!');
    return;
  }
  
  // 초기 빗방울들 생성
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      if (currentWeather === 'rain' && weatherContainer) {
        const drop = createRainDrop();
        weatherContainer.appendChild(drop);
        
        // 애니메이션 완료 후 제거
        setTimeout(() => {
          if (drop.parentNode) {
            drop.parentNode.removeChild(drop);
          }
        }, 3000);
      }
    }, i * 100);
  }
  
  // 지속적으로 빗방울 생성
  weatherInterval = setInterval(() => {
    if (currentWeather === 'rain' && weatherContainer) {
      const drop = createRainDrop();
      weatherContainer.appendChild(drop);
      
      setTimeout(() => {
        if (drop.parentNode) {
          drop.parentNode.removeChild(drop);
        }
      }, 3000);
    }
  }, 200);
}

function startSnow() {
  console.log('눈 효과 시작');
  clearWeather();
  currentWeather = 'snow';
  
  if (!weatherContainer) {
    console.error('weatherContainer를 찾을 수 없습니다!');
    return;
  }
  
  // 초기 눈송이들 생성
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      if (currentWeather === 'snow' && weatherContainer) {
        const flake = createSnowFlake();
        weatherContainer.appendChild(flake);
        
        // 애니메이션 완료 후 제거
        setTimeout(() => {
          if (flake.parentNode) {
            flake.parentNode.removeChild(flake);
          }
        }, 5000);
      }
    }, i * 150);
  }
  
  // 지속적으로 눈송이 생성
  weatherInterval = setInterval(() => {
    if (currentWeather === 'snow' && weatherContainer) {
      const flake = createSnowFlake();
      weatherContainer.appendChild(flake);
      
      setTimeout(() => {
        if (flake.parentNode) {
          flake.parentNode.removeChild(flake);
        }
      }, 5000);
    }
  }, 300);
}

function startClouds() {
  console.log('구름 효과 시작');
  clearWeather();
  currentWeather = 'cloud';
  
  if (!weatherContainer) {
    console.error('weatherContainer를 찾을 수 없습니다!');
    return;
  }
  
  // 구름들이 지속적으로 흘러가도록 생성
  const createNewCloud = () => {
    if (currentWeather === 'cloud' && weatherContainer) {
      const cloud = createCloud();
      weatherContainer.appendChild(cloud);
      
      // 12초 후 (애니메이션 완료 후) 제거
      setTimeout(() => {
        if (cloud.parentNode) {
          cloud.parentNode.removeChild(cloud);
        }
      }, 12000);
    }
  };
  
  // 초기 구름들 생성
  createNewCloud();
  setTimeout(createNewCloud, 3000);
  setTimeout(createNewCloud, 6000);
  
  // 지속적으로 새 구름 생성
  weatherInterval = setInterval(createNewCloud, 4000);
}

function startNight() {
  console.log('밤 효과 시작');
  clearWeather();
  currentWeather = 'night';
  
  // 다크 모드 적용
  document.body.classList.add('night-mode');
  
  if (!weatherContainer) {
    console.error('weatherContainer를 찾을 수 없습니다!');
    return;
  }
  
  // 별들 생성
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      if (currentWeather === 'night' && weatherContainer) {
        const star = createStar();
        weatherContainer.appendChild(star);
      }
    }, i * 200);
  }
  
  // 별똥별들 생성
  const createShootingStarInterval = () => {
    if (currentWeather === 'night' && weatherContainer) {
      const shootingStar = createShootingStar();
      weatherContainer.appendChild(shootingStar);
      
      // 3초 후 제거
      setTimeout(() => {
        if (shootingStar.parentNode) {
          shootingStar.parentNode.removeChild(shootingStar);
        }
      }, 3000);
    }
  };
  
  // 별똥별 주기적 생성
  weatherInterval = setInterval(createShootingStarInterval, 2000);
}

function startSunshine() {
  console.log('햇살 효과 시작');
  clearWeather();
  currentWeather = 'sunshine';
  
  if (!weatherContainer) {
    console.error('weatherContainer를 찾을 수 없습니다!');
    return;
  }
  
  // 고정된 태양 생성
  const sun = document.createElement('div');
  sun.className = 'ascii-art sun';
  sun.innerHTML = `    \\   |   /
     \\  |  /
   ---  ☀  ---
     /  |  \\
    /   |   \\`;
  sun.style.position = 'absolute';
  sun.style.left = '45%';
  sun.style.top = '5px';
  sun.style.color = '#ffa500';
  sun.style.fontSize = '14px';
  sun.style.fontFamily = 'Courier New, monospace';
  sun.style.fontWeight = 'bold';
  sun.style.zIndex = '6';
  sun.style.whiteSpace = 'pre';
  sun.style.lineHeight = '1';
  weatherContainer.appendChild(sun);
  
  // 햇살들 생성
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      if (currentWeather === 'sunshine' && weatherContainer) {
        const ray = createSunRay();
        weatherContainer.appendChild(ray);
      }
    }, i * 400);
  }
  
  // 지속적으로 햇살 생성
  weatherInterval = setInterval(() => {
    if (currentWeather === 'sunshine' && weatherContainer) {
      const ray = createSunRay();
      weatherContainer.appendChild(ray);
      
      // 7초 후 제거
      setTimeout(() => {
        if (ray.parentNode) {
          ray.parentNode.removeChild(ray);
        }
      }, 7000);
    }
  }, 800);
}

function toggleWeather() {
  console.log('날씨 토글, 현재 상태:', currentWeather);
  console.log('weatherContainer:', weatherContainer);
  console.log('weatherBtn:', weatherBtn);
  
  switch (currentWeather) {
    case 'none':
      startRain();
      if (weatherBtn) weatherBtn.textContent = '🌧️';
      break;
    case 'rain':
      startSnow();
      if (weatherBtn) weatherBtn.textContent = '❄️';
      break;
    case 'snow':
      startClouds();
      if (weatherBtn) weatherBtn.textContent = '☁️';
      break;
    case 'cloud':
      startSunshine();
      if (weatherBtn) weatherBtn.textContent = '☀️';
      break;
    case 'sunshine':
      startNight();
      if (weatherBtn) weatherBtn.textContent = '🌙';
      break;
    case 'night':
      clearWeather();
      currentWeather = 'none';
      if (weatherBtn) weatherBtn.textContent = '🌤️';
      break;
  }
}

// 모달 관련 함수들
function showModal(title, label, placeholder = '', defaultValue = '') {
  return new Promise((resolve, reject) => {
    modalResolve = resolve;
    modalReject = reject;
    
    modalTitle.textContent = title;
    modalLabel.textContent = label;
    modalInput.placeholder = placeholder;
    modalInput.value = defaultValue;
    
    modal.classList.remove('hidden');
    modalInput.focus();
    modalInput.select();
  });
}

function hideModal() {
  modal.classList.add('hidden');
  modalResolve = null;
  modalReject = null;
}

function confirmModal() {
  if (modalResolve) {
    modalResolve(modalInput.value);
    hideModal();
  }
}

function cancelModal() {
  if (modalReject) {
    modalReject(new Error('Cancelled'));
    hideModal();
  }
}

// 모달 이벤트 리스너
console.log('모달 이벤트 리스너 등록 시작');

// 모달 확인 버튼
if (modalConfirm) {
  console.log('모달 확인 버튼 이벤트 리스너 등록');
  modalConfirm.addEventListener('click', confirmModal);
} else {
  console.error('모달 확인 버튼을 찾을 수 없습니다!');
}

// 모달 취소 버튼
if (modalCancel) {
  console.log('모달 취소 버튼 이벤트 리스너 등록');
  modalCancel.addEventListener('click', cancelModal);
} else {
  console.error('모달 취소 버튼을 찾을 수 없습니다!');
}

// 모달 오버레이 클릭
if (modalOverlay) {
  console.log('모달 오버레이 이벤트 리스너 등록');
  modalOverlay.addEventListener('click', cancelModal);
} else {
  console.error('모달 오버레이를 찾을 수 없습니다!');
}

// 키보드 이벤트
if (modal) {
  console.log('모달 키보드 이벤트 리스너 등록');
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmModal();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelModal();
    }
  });
} else {
  console.error('모달 요소를 찾을 수 없습니다!');
}

// 메모 관련 함수들
function generateId() {
  return Date.now().toString();
}

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNoteList() {
  noteListEl.innerHTML = '';
  
  const sortedNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  
  sortedNotes.forEach(note => {
    const noteEl = document.createElement('div');
    noteEl.className = `note-item p-3 border border-gray-200 rounded-lg cursor-pointer transition-colors ${
      note.id === currentId ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
    }`;
    
    const preview = note.content.replace(/<[^>]*>/g, '').slice(0, 50) || '새 메모';
    const date = new Date(note.updatedAt).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    noteEl.innerHTML = `
      <div class="font-medium text-gray-900 mb-1">${preview}</div>
      <div class="text-xs text-gray-500">${date}</div>
      <button class="delete-btn" title="메모 삭제">×</button>
    `;
    
    // 메모 클릭 이벤트 (삭제 버튼 제외)
    noteEl.addEventListener('click', (e) => {
      if (!e.target.classList.contains('delete-btn')) {
        loadNote(note.id);
      }
    });
    
    // 삭제 버튼 클릭 이벤트
    const deleteBtn = noteEl.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // 메모 클릭 이벤트 방지
      deleteNote(note.id);
    });
    
    noteListEl.appendChild(noteEl);
  });
}

function loadNote(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  
  currentId = id;
  noteEditorEl.innerHTML = note.content;
  renderNoteList();
  
  // 링크 클릭 이벤트 재설정
  setupLinkClickHandlers();
}

function saveCurrentNote() {
  if (!currentId) return;
  
  const noteIndex = notes.findIndex(n => n.id === currentId);
  if (noteIndex >= 0) {
    notes[noteIndex].content = noteEditorEl.innerHTML;
    notes[noteIndex].updatedAt = Date.now();
    saveNotes();
  }
}

function createNewNote() {
  const id = generateId();
  const newNote = {
    id,
    content: '',
    updatedAt: Date.now()
  };
  
  notes.push(newNote);
  saveNotes();
  loadNote(id);
}

function deleteNote(id) {
  // 확인 대화상자
  if (!confirm('이 메모를 삭제하시겠습니까?')) {
    return;
  }
  
  // 메모 배열에서 제거
  notes = notes.filter(note => note.id !== id);
  saveNotes();
  
  // 현재 삭제된 메모를 보고 있었다면 다른 메모로 이동
  if (currentId === id) {
    if (notes.length > 0) {
      loadNote(notes[0].id);
    } else {
      // 메모가 없으면 새 메모 생성
      createNewNote();
    }
  }
  
  renderNoteList();
}

// 링크 클릭 핸들러 설정
function setupLinkClickHandlers() {
  const links = noteEditorEl.querySelectorAll('a');
  links.forEach(link => {
    // 기존 이벤트 리스너 제거
    link.removeEventListener('click', handleLinkClick);
    // 새 이벤트 리스너 추가
    link.addEventListener('click', handleLinkClick);
  });
}

function handleLinkClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const url = e.target.href;
  if (url && url !== 'javascript:void(0)') {
    // 새 탭에서 링크 열기
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

// 탭키 들여쓰기 처리
function handleTabIndentation(e) {
  e.preventDefault();
  
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  
  // 현재 li 요소 찾기
  let currentLi = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
  while (currentLi && currentLi.tagName !== 'LI') {
    currentLi = currentLi.parentElement;
    if (currentLi === noteEditorEl) {
      currentLi = null;
      break;
    }
  }
  
  if (!currentLi) return;
  
  const parentList = currentLi.parentElement;
  const isOrderedList = parentList.tagName === 'OL';
  const isShiftTab = e.shiftKey;
  
  if (isShiftTab) {
    // Shift+Tab: 내어쓰기
    const grandParent = parentList.parentElement;
    if (grandParent && grandParent.tagName === 'LI') {
      const greatGrandParent = grandParent.parentElement;
      if (greatGrandParent) {
        // 현재 li를 상위 레벨로 이동
        greatGrandParent.insertBefore(currentLi, grandParent.nextSibling);
        
        // 빈 리스트 정리
        if (parentList.children.length === 0) {
          parentList.remove();
        }
        
        // 부모 li 스타일 복원
        if (grandParent.children.length === 0) {
          grandParent.style.listStyle = '';
        }
      }
    }
  } else {
    // Tab: 들여쓰기
    const prevLi = currentLi.previousElementSibling;
    if (prevLi) {
      // 이전 li에 하위 리스트 생성 또는 추가
      let subList = prevLi.querySelector('ul, ol');
      if (!subList) {
        subList = document.createElement(isOrderedList ? 'ol' : 'ul');
        prevLi.appendChild(subList);
        // 부모 li의 마커 숨김
        prevLi.style.listStyle = 'none';
      }
      
      // 현재 li를 하위 리스트로 이동
      subList.appendChild(currentLi);
    }
  }
  
  // 변경사항 저장
  setTimeout(saveCurrentNote, 100);
}

// 편집 기능들
async function insertOrEditLink() {
  // 에디터에 포커스를 먼저 설정
  noteEditorEl.focus();
  
  const selection = window.getSelection();
  let selectedText = selection.toString();
  let existingLink = null;
  let range = null;
  
  // 선택 영역이 있는지 확인하고 없으면 커서 위치에 생성
  if (selection.rangeCount > 0) {
    range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const parentElement = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
    
    if (parentElement.tagName === 'A') {
      existingLink = parentElement;
      selectedText = existingLink.textContent;
    }
  } else {
    // 선택 영역이 없으면 에디터 끝에 새 범위 생성
    range = document.createRange();
    range.selectNodeContents(noteEditorEl);
    range.collapse(false); // 끝으로 이동
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  try {
    // URL 입력
    const url = await showModal(
      '링크 삽입', 
      'URL을 입력하세요:', 
      'https://example.com',
      existingLink ? existingLink.href : ''
    );
    
    if (!url.trim()) return;
    
    // 링크 텍스트 입력
    const linkText = await showModal(
      '링크 텍스트', 
      '링크에 표시될 텍스트를 입력하세요:', 
      '링크 텍스트',
      selectedText || url
    );
    
    if (!linkText.trim()) return;
    
    // URL 정규화
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    // 기존 링크 수정
    if (existingLink) {
      existingLink.href = finalUrl;
      existingLink.textContent = linkText;
      existingLink.target = '_blank';
      existingLink.rel = 'noopener noreferrer';
    } else {
      // 새 링크 생성
      const linkElement = document.createElement('a');
      linkElement.href = finalUrl;
      linkElement.textContent = linkText;
      linkElement.target = '_blank';
      linkElement.rel = 'noopener noreferrer';
      
      // 링크 삽입
      range.deleteContents();
      range.insertNode(linkElement);
      
      // 링크 뒤에 공백과 커서 위치
      const spaceNode = document.createTextNode(' ');
      range.setStartAfter(linkElement);
      range.insertNode(spaceNode);
      range.setStartAfter(spaceNode);
      range.setEndAfter(spaceNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    // 링크 클릭 핸들러 재설정
    setupLinkClickHandlers();
    
    // 변경사항 저장
    saveCurrentNote();
    renderNoteList();
    
    // 포커스 복원
    noteEditorEl.focus();
    
    console.log('링크 삽입 완료:', linkText, '→', finalUrl);
    
  } catch (error) {
    // 취소된 경우 무시
    console.log('링크 삽입 취소됨');
    noteEditorEl.focus();
  }
}

async function toggleBlockquote() {
  // 에디터에 포커스를 먼저 설정
  noteEditorEl.focus();
  
  const selection = window.getSelection();
  let range = null;
  
  // 선택 영역이 있는지 확인하고 없으면 커서 위치에 생성
  if (selection.rangeCount > 0) {
    range = selection.getRangeAt(0);
  } else {
    // 선택 영역이 없으면 에디터 끝에 새 범위 생성
    range = document.createRange();
    range.selectNodeContents(noteEditorEl);
    range.collapse(false); // 끝으로 이동
    selection.removeAllRanges();
    selection.addRange(range);
  }
  
  let container = range.commonAncestorContainer;
  
  // 텍스트 노드인 경우 부모 요소 가져오기
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  // 현재 blockquote 안에 있는지 확인
  let blockquote = container.closest('blockquote');
  
  if (blockquote) {
    // 기존 인용구 제거
    const parent = blockquote.parentElement;
    while (blockquote.firstChild) {
      parent.insertBefore(blockquote.firstChild, blockquote);
    }
    blockquote.remove();
    console.log('인용구 제거됨');
  } else {
    try {
      // 새 인용구 텍스트 입력
      const quoteText = await showModal(
        '인용구 삽입', 
        '인용할 텍스트를 입력하세요:', 
        '인용구 내용...',
        selection.toString()
      );
      
      if (!quoteText.trim()) return;
      
      // 인용구 요소 생성
      const blockquoteElement = document.createElement('blockquote');
      blockquoteElement.textContent = quoteText;
      
      // 선택 영역 교체
      range.deleteContents();
      range.insertNode(blockquoteElement);
      
      // 인용구 뒤에 줄바꿈과 커서 위치
      const brNode = document.createElement('br');
      range.setStartAfter(blockquoteElement);
      range.insertNode(brNode);
      range.setStartAfter(brNode);
      range.setEndAfter(brNode);
      selection.removeAllRanges();
      selection.addRange(range);
      
      console.log('인용구 삽입 완료:', quoteText);
      
    } catch (error) {
      // 취소된 경우 무시
      console.log('인용구 삽입 취소됨');
    }
  }
  
  // 변경사항 저장
  saveCurrentNote();
  renderNoteList();
  
  // 포커스 복원
  noteEditorEl.focus();
}

function executeCommand(command, value = null) {
  noteEditorEl.focus();
  
  try {
    const success = document.execCommand(command, false, value);
    if (!success && command === 'insertUnorderedList') {
      // execCommand 실패 시 수동으로 불릿 리스트 삽입
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        li.textContent = '새 항목';
        ul.appendChild(li);
        
        range.deleteContents();
        range.insertNode(ul);
        
        // li 내부에 커서 위치
        range.setStart(li.firstChild, 0);
        range.setEnd(li.firstChild, li.firstChild.textContent.length);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  } catch (error) {
    console.warn('execCommand failed:', command, error);
  }
  
  // 링크 관련 명령어 후 핸들러 재설정
  if (command === 'createLink' || command === 'insertHTML') {
    setTimeout(setupLinkClickHandlers, 100);
  }
}

function changeFontSize(increase) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  if (range.collapsed) return;
  
  const span = document.createElement('span');
  span.style.fontSize = increase ? '1.25em' : '0.75em';
  
  try {
    range.surroundContents(span);
  } catch (error) {
    // 복잡한 선택 영역의 경우
    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);
  }
  
  // 선택 해제
  selection.removeAllRanges();
  noteEditorEl.focus();
}

// 이벤트 리스너들
newNoteBtn.addEventListener('click', createNewNote);

// 에디터 변경 감지
let saveTimeout;
noteEditorEl.addEventListener('input', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveCurrentNote, 100);
});

// 키보드 단축키
noteEditorEl.addEventListener('keydown', (e) => {
  // Tab 키 처리
  if (e.key === 'Tab') {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      
      // li 요소 안에 있는지 확인
      let currentElement = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
      while (currentElement && currentElement !== noteEditorEl) {
        if (currentElement.tagName === 'LI') {
          handleTabIndentation(e);
          return;
        }
        currentElement = currentElement.parentElement;
      }
    }
  }
  
  // 기본 단축키들
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'b':
        e.preventDefault();
        executeCommand('bold');
        break;
      case 'i':
        e.preventDefault();
        executeCommand('italic');
        break;
      case 'u':
        e.preventDefault();
        executeCommand('underline');
        break;
    }
  }
});

// 툴바 이벤트 리스너
console.log('툴바 이벤트 리스너 등록 시작');
const toolbarElement = document.getElementById('toolbar');
if (toolbarElement) {
  console.log('툴바 요소 찾음, 이벤트 리스너 등록');
  toolbarElement.addEventListener('click', async (e) => {
    console.log('툴바 클릭 이벤트 발생:', e.target);
    const button = e.target.closest('[data-cmd]');
    if (!button) {
      console.log('data-cmd 속성이 없는 요소 클릭됨');
      return;
    }
    
    const cmd = button.dataset.cmd;
    console.log('버튼 클릭됨:', cmd); // 디버깅용
    
    switch (cmd) {
      case 'bold':
      case 'italic':
      case 'underline':
      case 'strikethrough':
      case 'insertUnorderedList':
      case 'insertOrderedList':
      case 'unlink':
        executeCommand(cmd);
        break;
        
      case 'link':
        await insertOrEditLink();
        break;
        
      case 'blockquote':
        await toggleBlockquote();
        break;
        
      case 'insertHorizontalRule':
        executeCommand('insertHTML', '<hr>');
        break;
        
      case 'fontSize-large':
        changeFontSize(true);
        break;
        
      case 'fontSize-small':
        changeFontSize(false);
        break;
        
      default:
        console.log('알 수 없는 명령어:', cmd);
    }
    
    // 변경사항 저장
    setTimeout(() => {
      saveCurrentNote();
      renderNoteList();
    }, 100);
    
    noteEditorEl.focus();
  });
} else {
  console.error('툴바 요소를 찾을 수 없습니다!');
}

// 에디터 클릭 이벤트 - 링크 처리
noteEditorEl.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    handleLinkClick(e);
  }
});

// 날씨 버튼 이벤트 리스너
if (weatherBtn) {
  console.log('날씨 버튼 이벤트 리스너 등록');
  weatherBtn.addEventListener('click', toggleWeather);
} else {
  console.error('날씨 버튼을 찾을 수 없습니다!');
}

// 초기화
function init() {
  renderNoteList();
  
  if (notes.length === 0) {
    createNewNote();
  } else {
    loadNote(notes[0].id);
  }
  
  // 날씨 버튼 초기 상태 설정
  if (weatherBtn) {
    weatherBtn.textContent = '☁️';
  }
  
  // 날씨 컨테이너 확인
  console.log('초기화 시 날씨 컨테이너:', weatherContainer);
}

init(); 