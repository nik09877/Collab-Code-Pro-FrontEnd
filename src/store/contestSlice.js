import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  minRating: 500,
  maxRating: 3000,
  maxDuration: 30,
  contest: null,
  problemTags: [],
  questionLoading: false,
  showContestEndedModal: false,
  contestEnded: false,
};

export const contestSlice = createSlice({
  name: 'contest',
  initialState,
  reducers: {
    updateMinRating: (state, action) => {
      state.minRating = action.payload;
    },
    updateMaxRating: (state, action) => {
      state.maxRating = action.payload;
    },
    updateMaxDuration: (state, action) => {
      state.maxDuration = action.payload;
    },
    updateContest: (state, action) => {
      state.contest = action.payload;
    },
    updateProblemTags: (state, action) => {
      state.problemTags = action.payload;
    },
    setQuestionLoading: (state, action) => {
      state.questionLoading = true;
    },
    resetQuestionLoading: (state, action) => {
      state.questionLoading = false;
    },
    updateContestEnded: (state, action) => {
      state.contestEnded = action.payload;
      // state.showContestEndedModal = action.payload;
    },
    showContestEndedModal: (state, action) => {
      state.showContestEndedModal = true;
    },
    hideContestEndedModal: (state, action) => {
      state.showContestEndedModal = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateMinRating,
  updateMaxRating,
  updateMaxDuration,
  updateContest,
  updateProblemTags,
  setQuestionLoading,
  resetQuestionLoading,
  updateContestEnded,
  showContestEndedModal,
  hideContestEndedModal,
} = contestSlice.actions;

export default contestSlice.reducer;
