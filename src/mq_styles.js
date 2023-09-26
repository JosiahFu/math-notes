import { addStyles } from 'react-mathquill';
// We need this to be applied BEFORE importing mathquill.css because styles
// there need to override, so now we have this tiny script file
addStyles();
