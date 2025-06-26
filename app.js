// 메모 데이터는 localStorage에 JSON 포맷으로 저장됩니다.
const noteListEl = document.getElementById('note-list');
const noteEditorEl = document.getElementById('note-editor');
const newNoteBtn = document.getElementById('new-note');

// 모달 관련 요소들
const modal = document.getElementById('text-input-modal');
const modalTitle = document.getElementById('modal-title');
const modalLabel = document.getElementById('modal-label');
const modalInput = document.getElementById('modal-input');
const modalOverlay = document.getElementById('modal-overlay');
const modalCancel = document.getElementById('modal-cancel');
const modalConfirm = document.getElementById('modal-confirm');

// notes: [{ id: string, content: string, updatedAt: number }]
let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let currentId = null;

// 모달 관련 변수
let modalResolve = null;
let modalReject = null;

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
modalConfirm.addEventListener('click', confirmModal);
modalCancel.addEventListener('click', cancelModal);
modalOverlay.addEventListener('click', cancelModal);

// 모달 키보드 이벤트
modalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    confirmModal();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    cancelModal();
  }
});

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
    noteEl.className = `p-3 border border-gray-200 rounded-lg cursor-pointer transition-colors ${
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
    `;
    
    noteEl.addEventListener('click', () => loadNote(note.id));
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
document.getElementById('toolbar').addEventListener('click', async (e) => {
  const button = e.target.closest('[data-cmd]');
  if (!button) return;
  
  const cmd = button.dataset.cmd;
  
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
      
    case 'hr':
      executeCommand('insertHTML', '<hr>');
      break;
      
    case 'increaseSize':
      changeFontSize(true);
      break;
      
    case 'decreaseSize':
      changeFontSize(false);
      break;
  }
  
  // 변경사항 저장
  setTimeout(saveCurrentNote, 100);
  noteEditorEl.focus();
});

// 에디터 클릭 이벤트 - 링크 처리
noteEditorEl.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    handleLinkClick(e);
  }
});

// 초기화
function init() {
  renderNoteList();
  
  if (notes.length === 0) {
    createNewNote();
  } else {
    loadNote(notes[0].id);
  }
}

init(); 