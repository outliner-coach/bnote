// 메모 데이터 저장소
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteId = null;

// DOM 요소
const noteList = document.getElementById('note-list');
const noteEditor = document.getElementById('note-editor');
const newNoteBtn = document.getElementById('new-note');
const toolbar = document.getElementById('toolbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobile-overlay');

// 모달 요소
const modal = document.getElementById('text-input-modal');
const modalTitle = document.getElementById('modal-title');
const modalLabel = document.getElementById('modal-label');
const modalInput = document.getElementById('modal-input');
const modalConfirm = document.getElementById('modal-confirm');
const modalCancel = document.getElementById('modal-cancel');
const modalOverlay = document.getElementById('modal-overlay');

// 날씨 효과 관련
const weatherBtn = document.getElementById('weather-btn');
const weatherContainer = document.getElementById('weather-container');
let currentWeather = 'cloudy';
let weatherInterval = null;
let isNightMode = false;

// 메모 고유 ID 생성
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 메모 저장
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// 메모 목록 렌더링
function renderNoteList() {
  noteList.innerHTML = '';
  
  notes.forEach(note => {
    const li = document.createElement('li');
    li.className = 'note-item p-4 hover:bg-gray-50 cursor-pointer relative';
    li.dataset.noteId = note.id;
    
    if (note.id === currentNoteId) {
      li.classList.add('bg-blue-50', 'border-r-4', 'border-blue-500');
    }
    
    const preview = note.content.replace(/<[^>]*>/g, '').slice(0, 50) || '새 메모';
    const timestamp = new Date(note.updatedAt).toLocaleDateString('ko-KR');
    
    li.innerHTML = 
      <div class="font-medium text-gray-900 truncate"></div>
      <div class="text-sm text-gray-500 mt-1"></div>
      <button class="delete-btn" onclick="deleteNote('', event)" title="삭제"></button>
    ;
    
    li.addEventListener('click', () => selectNote(note.id));
    noteList.appendChild(li);
  });
}

// 새 메모 생성
function createNewNote() {
  const newNote = {
    id: generateId(),
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  notes.unshift(newNote);
  saveNotes();
  selectNote(newNote.id);
  renderNoteList();
  
  // 모바일에서 새 메모 생성 시 사이드바 닫기
  if (window.innerWidth <= 768) {
    closeMobileSidebar();
  }
}

// 메모 선택
function selectNote(noteId) {
  // 현재 메모 저장
  if (currentNoteId) {
    saveCurrentNote();
  }
  
  currentNoteId = noteId;
  const note = notes.find(n => n.id === noteId);
  
  if (note) {
    noteEditor.innerHTML = note.content;
    renderNoteList();
  }
}

// 현재 메모 저장
function saveCurrentNote() {
  if (!currentNoteId) return;
  
  const note = notes.find(n => n.id === currentNoteId);
  if (note) {
    note.content = noteEditor.innerHTML;
    note.updatedAt = new Date().toISOString();
    saveNotes();
  }
}

// 메모 삭제
function deleteNote(noteId, event) {
  event.stopPropagation();
  
  if (confirm('이 메모를 삭제하시겠습니까?')) {
    notes = notes.filter(note => note.id !== noteId);
    saveNotes();
    
    if (currentNoteId === noteId) {
      currentNoteId = null;
      noteEditor.innerHTML = '';
    }
    
    renderNoteList();
  }
}

// 모바일 사이드바 토글
function toggleMobileSidebar() {
  sidebar.classList.toggle('open');
  mobileOverlay.classList.toggle('active');
}

function closeMobileSidebar() {
  sidebar.classList.remove('open');
  mobileOverlay.classList.remove('active');
}

// 텍스트 입력 모달 표시
function showTextInputModal(title, label, placeholder = '', callback) {
  modalTitle.textContent = title;
  modalLabel.textContent = label;
  modalInput.placeholder = placeholder;
  modalInput.value = '';
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  
  // 애니메이션을 위한 약간의 지연
  setTimeout(() => {
    modal.querySelector('.modal-content').classList.remove('scale-95');
    modal.querySelector('.modal-content').classList.add('scale-100');
    modalInput.focus();
  }, 10);
  
  // 이벤트 리스너 정리
  modalConfirm.onclick = null;
  modalCancel.onclick = null;
  modalOverlay.onclick = null;
  modalInput.onkeydown = null;
  
  // 새 이벤트 리스너 등록
  modalConfirm.onclick = () => {
    const value = modalInput.value.trim();
    if (value) {
      callback(value);
      hideTextInputModal();
    }
  };
  
  modalCancel.onclick = hideTextInputModal;
  modalOverlay.onclick = hideTextInputModal;
  
  modalInput.onkeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      modalConfirm.click();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      hideTextInputModal();
    }
  };
}

// 텍스트 입력 모달 숨기기
function hideTextInputModal() {
  modal.querySelector('.modal-content').classList.remove('scale-100');
  modal.querySelector('.modal-content').classList.add('scale-95');
  
  setTimeout(() => {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }, 200);
}

// 링크 생성/편집
function createOrEditLink() {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  
  // 선택된 텍스트가 있는지 확인
  if (selection.isCollapsed) {
    // 선택된 텍스트가 없으면 링크 텍스트부터 입력받기
    showTextInputModal(
      '링크 추가',
      '링크 텍스트를 입력하세요:',
      '링크 텍스트',
      (linkText) => {
        showTextInputModal(
          '링크 추가',
          'URL을 입력하세요:',
          'https://',
          (url) => {
            // URL에 프로토콜이 없으면 추가
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
              url = 'https://' + url;
            }
            
            // 링크 요소 생성
            const link = document.createElement('a');
            link.href = url;
            link.textContent = linkText;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            
            // 현재 커서 위치에 삽입
            range.insertNode(link);
            
            // 커서를 링크 뒤로 이동
            range.setStartAfter(link);
            range.setEndAfter(link);
            selection.removeAllRanges();
            selection.addRange(range);
            
            saveCurrentNote();
          }
        );
      }
    );
    return;
  }
  
  const selectedText = selection.toString();
  const parentElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE 
    ? range.commonAncestorContainer.parentElement 
    : range.commonAncestorContainer;
  
  // 기존 링크인지 확인
  const existingLink = parentElement.closest('a');
  
  if (existingLink) {
    // 기존 링크 편집
    showTextInputModal(
      '링크 편집',
      '새 URL을 입력하세요:',
      existingLink.href,
      (url) => {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        existingLink.href = url;
        saveCurrentNote();
      }
    );
  } else {
    // 새 링크 생성
    showTextInputModal(
      '링크 추가',
      'URL을 입력하세요:',
      'https://',
      (url) => {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        
        const link = document.createElement('a');
        link.href = url;
        link.textContent = selectedText;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        range.deleteContents();
        range.insertNode(link);
        
        saveCurrentNote();
      }
    );
  }
}

// 인용구 추가
function addBlockquote() {
  showTextInputModal(
    '인용구 추가',
    '인용구 내용을 입력하세요:',
    '인용구 내용',
    (text) => {
      const blockquote = document.createElement('blockquote');
      blockquote.textContent = text;
      
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      
      range.insertNode(blockquote);
      range.setStartAfter(blockquote);
      range.setEndAfter(blockquote);
      selection.removeAllRanges();
      selection.addRange(range);
      
      saveCurrentNote();
    }
  );
}

// 글자 크기 조정
function adjustFontSize(increase) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  if (range.collapsed) return;
  
  // 선택된 텍스트를 span으로 감싸기
  const span = document.createElement('span');
  
  try {
    range.surroundContents(span);
  } catch (e) {
    // 복잡한 선택의 경우 내용을 추출하고 새로 만들기
    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);
  }
  
  // 현재 폰트 크기 가져오기
  const currentSize = parseInt(window.getComputedStyle(span).fontSize) || 16;
  
  // 새 크기 계산
  let newSize;
  if (increase) {
    newSize = Math.min(currentSize + 2, 32); // 최대 32px
  } else {
    newSize = Math.max(currentSize - 2, 10); // 최소 10px
  }
  
  // 폰트 크기 적용
  span.style.fontSize = newSize + 'px';
  
  saveCurrentNote();
}

// 들여쓰기 처리
function handleIndentation(event) {
  if (event.key === 'Tab') {
    event.preventDefault();
    
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const currentElement = range.startContainer.nodeType === Node.TEXT_NODE 
      ? range.startContainer.parentElement 
      : range.startContainer;
    
    // 현재 들여쓰기 레벨 확인
    let currentLevel = 0;
    let element = currentElement;
    while (element && element !== noteEditor) {
      if (element.style && element.style.marginLeft) {
        const margin = parseInt(element.style.marginLeft);
        currentLevel = Math.floor(margin / 20);
        break;
      }
      element = element.parentElement;
    }
    
    // 최대 3레벨까지만 허용
    if (currentLevel < 3) {
      const newLevel = currentLevel + 1;
      const marginLeft = newLevel * 20 + 'px';
      
      if (element && element !== noteEditor) {
        element.style.marginLeft = marginLeft;
      } else {
        // 새로운 div로 감싸기
        const div = document.createElement('div');
        div.style.marginLeft = marginLeft;
        
        try {
          range.surroundContents(div);
        } catch (e) {
          const contents = range.extractContents();
          div.appendChild(contents);
          range.insertNode(div);
        }
      }
      
      saveCurrentNote();
    }
  }
}

// 날씨 효과 함수들
function clearWeatherEffects() {
  if (weatherInterval) {
    clearInterval(weatherInterval);
    weatherInterval = null;
  }
  weatherContainer.innerHTML = '';
  
  // 밤 모드 해제
  if (isNightMode) {
    document.body.classList.remove('night-mode');
    isNightMode = false;
  }
}

function createRainEffect() {
  clearWeatherEffects();
  
  weatherInterval = setInterval(() => {
    const drops = ['|', '/', '\\', '|'];
    for (let i = 0; i < 15; i++) {
      const drop = document.createElement('div');
      drop.className = 'ascii-art rain';
      drop.textContent = drops[Math.floor(Math.random() * drops.length)];
      drop.style.left = Math.random() * 100 + '%';
      drop.style.top = Math.random() * 20 + 'px';
      drop.style.animationDelay = Math.random() * 2 + 's';
      weatherContainer.appendChild(drop);
      
      setTimeout(() => {
        if (drop.parentNode) {
          drop.parentNode.removeChild(drop);
        }
      }, 2000);
    }
  }, 200);
}

function createSnowEffect() {
  clearWeatherEffects();
  
  weatherInterval = setInterval(() => {
    const flakes = ['*', '', '', ''];
    for (let i = 0; i < 10; i++) {
      const flake = document.createElement('div');
      flake.className = 'ascii-art snow';
      flake.textContent = flakes[Math.floor(Math.random() * flakes.length)];
      flake.style.left = Math.random() * 100 + '%';
      flake.style.top = Math.random() * 20 + 'px';
      flake.style.animationDelay = Math.random() * 4 + 's';
      weatherContainer.appendChild(flake);
      
      setTimeout(() => {
        if (flake.parentNode) {
          flake.parentNode.removeChild(flake);
        }
      }, 4000);
    }
  }, 500);
}

function createCloudEffect() {
  clearWeatherEffects();
  
  const cloudShapes = [
    '    ',
    '  ',
    '',
    '    ',
    '  '
  ];
  
  weatherInterval = setInterval(() => {
    const cloud = document.createElement('div');
    cloud.className = 'ascii-art cloud';
    cloud.textContent = cloudShapes[Math.floor(Math.random() * cloudShapes.length)];
    cloud.style.top = Math.random() * 60 + 20 + 'px';
    cloud.style.left = '-150px';
    cloud.style.animationDelay = Math.random() * 3 + 's';
    weatherContainer.appendChild(cloud);
    
    setTimeout(() => {
      if (cloud.parentNode) {
        cloud.parentNode.removeChild(cloud);
      }
    }, 12000);
  }, 2000);
}

function createSunEffect() {
  clearWeatherEffects();
  
  // 고정된 태양
  const sun = document.createElement('div');
  sun.className = 'ascii-art sun';
  sun.textContent = '';
  sun.style.top = '20px';
  sun.style.right = '50px';
  sun.style.position = 'absolute';
  weatherContainer.appendChild(sun);
  
  // 햇살 효과
  const rayPositions = [
    { top: '35px', right: '80px', char: '\\' },
    { top: '25px', right: '90px', char: '|' },
    { top: '35px', right: '100px', char: '/' },
    { top: '45px', right: '90px', char: '|' },
    { top: '55px', right: '80px', char: '\\' },
    { top: '45px', right: '100px', char: '/' }
  ];
  
  weatherInterval = setInterval(() => {
    rayPositions.forEach((pos, index) => {
      setTimeout(() => {
        const ray = document.createElement('div');
        ray.className = 'ascii-art sun-ray';
        ray.textContent = pos.char;
        ray.style.top = pos.top;
        ray.style.right = pos.right;
        ray.style.position = 'absolute';
        weatherContainer.appendChild(ray);
        
        setTimeout(() => {
          if (ray.parentNode) {
            ray.parentNode.removeChild(ray);
          }
        }, 4000);
      }, index * 200);
    });
  }, 1000);
}

function createNightEffect() {
  clearWeatherEffects();
  
  // 밤 모드 활성화
  document.body.classList.add('night-mode');
  isNightMode = true;
  
  // 별 생성
  for (let i = 0; i < 20; i++) {
    const star = document.createElement('div');
    star.className = 'ascii-art star';
    star.textContent = '';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 80 + 'px';
    star.style.position = 'absolute';
    star.style.animationDelay = Math.random() * 2 + 's';
    weatherContainer.appendChild(star);
  }
  
  // 별똥별 효과
  weatherInterval = setInterval(() => {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'ascii-art shooting-star';
    shootingStar.textContent = '';
    shootingStar.style.position = 'absolute';
    weatherContainer.appendChild(shootingStar);
    
    setTimeout(() => {
      if (shootingStar.parentNode) {
        shootingStar.parentNode.removeChild(shootingStar);
      }
    }, 3000);
  }, 4000);
}

// 날씨 전환
function switchWeather() {
  const weatherStates = ['cloudy', 'rainy', 'snowy', 'cloudy2', 'sunny', 'night'];
  const weatherIcons = ['', '', '', '', '', ''];
  
  const currentIndex = weatherStates.indexOf(currentWeather);
  const nextIndex = (currentIndex + 1) % weatherStates.length;
  currentWeather = weatherStates[nextIndex];
  weatherBtn.textContent = weatherIcons[nextIndex];
  
  switch (currentWeather) {
    case 'rainy':
      createRainEffect();
      break;
    case 'snowy':
      createSnowEffect();
      break;
    case 'cloudy':
    case 'cloudy2':
      createCloudEffect();
      break;
    case 'sunny':
      createSunEffect();
      break;
    case 'night':
      createNightEffect();
      break;
    default:
      clearWeatherEffects();
  }
}

// 이벤트 리스너 등록
newNoteBtn.addEventListener('click', createNewNote);
mobileMenuBtn.addEventListener('click', toggleMobileSidebar);
mobileOverlay.addEventListener('click', closeMobileSidebar);
weatherBtn.addEventListener('click', switchWeather);

// 툴바 버튼 이벤트
toolbar.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;
  
  const cmd = button.dataset.cmd;
  
  switch (cmd) {
    case 'link':
      createOrEditLink();
      break;
    case 'unlink':
      document.execCommand('unlink');
      saveCurrentNote();
      break;
    case 'blockquote':
      addBlockquote();
      break;
    case 'fontSize-large':
      adjustFontSize(true);
      break;
    case 'fontSize-small':
      adjustFontSize(false);
      break;
    case 'insertUnorderedList':
    case 'insertOrderedList':
      if (!document.execCommand(cmd)) {
        // execCommand 실패 시 수동으로 리스트 추가
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const listType = cmd === 'insertUnorderedList' ? 'ul' : 'ol';
        const list = document.createElement(listType);
        const li = document.createElement('li');
        li.textContent = '새 항목';
        list.appendChild(li);
        
        range.insertNode(list);
        range.setStart(li.firstChild, 0);
        range.setEnd(li.firstChild, li.textContent.length);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      saveCurrentNote();
      break;
    default:
      document.execCommand(cmd);
      saveCurrentNote();
  }
});

// 에디터 이벤트
noteEditor.addEventListener('input', () => {
  saveCurrentNote();
  renderNoteList();
});

noteEditor.addEventListener('keydown', handleIndentation);

// 링크 클릭 처리
noteEditor.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      window.open(e.target.href, '_blank');
    }
  }
});

// 윈도우 리사이즈 이벤트
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMobileSidebar();
  }
});

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  renderNoteList();
  
  // 첫 번째 메모가 있으면 선택
  if (notes.length > 0) {
    selectNote(notes[0].id);
  }
  
  // 초기 날씨 효과
  createCloudEffect();
});
