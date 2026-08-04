
const ALGO_SELECTORS = {
  LeetCode: {
    title: 'span.text-title-large, div[class*="text-title-large"], h4',
    difficultyEasy: '.text-difficulty-Easy, [class*="text-difficulty-Easy"], .text-success, [class*="text-brand-green"]',
    difficultyMedium: '.text-difficulty-Medium, [class*="text-difficulty-Medium"], .text-warning, [class*="text-brand-orange"]',
    difficultyHard: '.text-difficulty-Hard, [class*="text-difficulty-Hard"], .text-danger, [class*="text-brand-red"]',
    
    
    acceptedStatus: '[data-e2e-locator="submission-result"]',
    editorTextarea: '.monaco-editor textarea, [class*="monaco-editor"] textarea',
    
    
    hintBtn: '[data-cy="hint-btn"], button[id*="hint"], [class*="hint"]',
    solutionBtn: '[data-cy="solution-btn"], a[href*="/editorial"], a[href*="/solutions"]'
  },
  GeeksforGeeks: {
    title: '.problem-tab_title, div[class*="problems_header_content__title"], div[class*="problem_title"], h3[class*="problem-title"], h3, h4',
    difficulty: '.problem-tab_difficulty, div[class*="difficulty"], div[class*="attribute"]',
    
    
    acceptedStatus: '.problem-tab_accepted, div[class*="success"], .result, div[class*="output_status"], div[class*="submissionResult"], div[class*="status"]',
    editorTextarea: '.ace_text-input, textarea[class*="ace"], .monaco-editor textarea',
    
    
    hintBtn: 'button[id*="hint"], [class*="hint"]',
    solutionBtn: 'div[class*="editorial"], a[href*="editorial"], [href*="comment"], [href*="discussion"], [class*="comment"], [class*="discussion"], button[id*="comment"], button[class*="comment"], .problem-tab_comments, [class*="comments"]'
  },
  Codeforces: {
    title: '.title .title, .problem-statement .header .title, div.problemindexholder h2',
    difficulty: '.tag-box[title*="difficulty"], .tag-box',

    
    acceptedStatus: '.verdict-accepted, .accepted-shown, span.verdict-accepted',
    editorTextarea: '#sourceCodeTextarea, textarea[name="sourceCode"], .ace_text-input',

    
    hintBtn: null, 
    solutionBtn: 'a[href*="/tutorial"], a[href*="/editorial"]'
  },
  AtCoder: {
    title: '.h2, #task-statement h2, span.h2',
    difficulty: null, 

    
    acceptedStatus: '.submission-result[data-status="AC"], td.text-success',
    editorTextarea: '.ace_text-input, textarea#sourceCode',

    
    hintBtn: null, 
    solutionBtn: 'a[href*="editorial"]'
  },
  CodeChef: {
    title: '.breadcrumbs h1, h1.problem-name, .problem-name',
    difficulty: '.diff-tag, .problem-difficulty, span[class*="difficulty"]',

    
    acceptedStatus: '.status-accepted, span._successMsg, [class*="accepted"]',
    editorTextarea: '.ace_text-input, .monaco-editor textarea',

    
    hintBtn: null,
    solutionBtn: 'a[href*="editorial"], a[href*="/discuss"]'
  },
  HackerRank: {
    title: '.challenge-view h2, .challenge-body-html h2, .challenge_title',
    difficulty: '.difficulty-label, .difficulty-block span, .sidebar-problem-difficulty',

    
    acceptedStatus: '.congrats-heading, .challenge-submission-accepted, .result-accepted',
    editorTextarea: '.ace_text-input, .monaco-editor textarea, .custom-hackEditor textarea',

    
    hintBtn: null,
    solutionBtn: 'a[href*="editorial"], a[href*="/forum"]'
  }
};
window.ALGO_SELECTORS = ALGO_SELECTORS;
