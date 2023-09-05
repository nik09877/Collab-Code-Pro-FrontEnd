import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: 'cpp',
  theme: 'monokai',
  nowCompile: false,
  isLoading: false,
  fontSize: 20,
  input: '',
  output: '',
  output_success: false,
  output_error: false,
  showGraph: false,
  code: '',
  uploaded_code: '',
};

export const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    setCompileOn: (state, action) => {
      state.nowCompile = true;
    },
    setCompileOff: (state, action) => {
      state.nowCompile = false;
    },
    setLoading: (state, action) => {
      state.isLoading = true;
    },
    resetLoading: (state, action) => {
      state.isLoading = false;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    setInput: (state, action) => {
      state.input = action.payload;
    },
    setOutput: (state, action) => {
      state.output = action.payload;
    },
    notifyOutputSuccess: (state, action) => {
      state.output_success = action.payload;
    },
    notifyOutputError: (state, action) => {
      state.output_error = action.payload;
    },
    showGraph: (state, action) => {
      state.showGraph = true;
    },
    hideGraph: (state, action) => {
      state.showGraph = false;
    },
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setUploadedCode: (state, action) => {
      state.uploaded_code = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCompileOn,
  setCompileOff,
  setLoading,
  resetLoading,
  setLanguage,
  setTheme,
  setFontSize,
  setInput,
  setOutput,
  notifyOutputSuccess,
  notifyOutputError,
  showGraph,
  hideGraph,
  setCode,
  setUploadedCode,
} = toolsSlice.actions;

export default toolsSlice.reducer;
