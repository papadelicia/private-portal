let currentPhase = "1";
let currentPhraseIndex = 0;

// ページ読み込み時に保存された進捗を復元
window.addEventListener('load', () => {
    const saved = localStorage.getItem('progress');
    if (saved) {
        const progress = JSON.parse(saved);
        currentPhase = progress.phase;
        currentPhraseIndex = progress.phraseIndex;
        
        // 保存されたフェーズのボタンをアクティブに
        document.querySelectorAll('.phase-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.phase === currentPhase) {
                btn.classList.add('active');
            }
        });
    }
    displayPhrase();
});

// フェーズ切り替え
document.querySelectorAll('.phase-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.phase-btn.active').classList.remove('active');
        e.target.classList.add('active');
        currentPhase = e.target.dataset.phase;
        currentPhraseIndex = 0;
        displayPhrase();
        saveProgress(); // 進捗を保存
    });
});

// フレーズ表示関数
function displayPhrase() {
    const phase = phrasesData[currentPhase];
    const phrase = phase.phrases[currentPhraseIndex];
    
    const displayHTML = `
        <div class="phrase-card">
            <h2>${phase.title}</h2>
            <div class="chinese-text">${phrase.chinese}</div>
            <div class="pinyin">${phrase.pinyin}</div>
            <div class="japanese">${phrase.japanese}</div>
            <div class="context">使用場面: ${phrase.context}</div>
        </div>
        <div class="progress">
            ${currentPhraseIndex + 1} / ${phase.phrases.length}
        </div>
    `;
    
    document.getElementById('phrase-display').innerHTML = displayHTML;
}

// ナビゲーション
document.getElementById('next-btn').addEventListener('click', () => {
    const maxIndex = phrasesData[currentPhase].phrases.length - 1;
    if (currentPhraseIndex < maxIndex) {
        currentPhraseIndex++;
        displayPhrase();
        saveProgress(); // 進捗を保存
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPhraseIndex > 0) {
        currentPhraseIndex--;
        displayPhrase();
        saveProgress(); // 進捗を保存
    }
});

// 学習進捗を保存する関数
function saveProgress() {
    const progress = {
        phase: currentPhase,
        phraseIndex: currentPhraseIndex,
        learned: JSON.parse(localStorage.getItem('learned') || '[]')
    };
    
    const phraseId = `${currentPhase}-${currentPhraseIndex}`;
    if (!progress.learned.includes(phraseId)) {
        progress.learned.push(phraseId);
    }
    
    localStorage.setItem('progress', JSON.stringify(progress));
    localStorage.setItem('learned', JSON.stringify(progress.learned));
}

// 初期表示
displayPhrase();

// 音声再生機能
document.getElementById('audio-btn').addEventListener('click', () => {
    const phase = phrasesData[currentPhase];
    const phrase = phase.phrases[currentPhraseIndex];
    
    // 中国語の音声読み上げ
    const utterance = new SpeechSynthesisUtterance(phrase.chinese);
    utterance.lang = 'zh-CN'; // 中国語（簡体字）
    utterance.rate = 0.8; // 速度を少し遅めに
    
    speechSynthesis.speak(utterance);
});