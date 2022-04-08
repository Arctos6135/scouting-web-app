import * as React from 'react';

// Context that stores the id of a form
// Inputs for that form use this to know where to store their values
export const FormIDContext = React.createContext('');