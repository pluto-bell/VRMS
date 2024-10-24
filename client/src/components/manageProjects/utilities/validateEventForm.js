import validator from 'validator';
import { isWordInArrayInString } from './../../../utils/stringUtils.js';
import { eventNameBlacklistArr } from '../../../utils/blacklist.js';

const validateEventForm = (vals, projectToEdit) => {
  let newErrors = {};
  Object.keys(vals).forEach((key) => {
    switch (key) {
      case 'name':
        // Required
        if (!vals[key]) {
          newErrors = { ...newErrors, name: 'Event name is required' };
        } else if (
          isWordInArrayInString(
            eventNameBlacklistArr,
            vals[key].toLowerCase()
          )
        ) {
          newErrors = {
            ...newErrors,
            name: `Event name cannot contain: ${vals[key]}`,
          };
        } else if (
          isWordInArrayInString(
            [projectToEdit.name.toLowerCase()],
            vals[key].toLowerCase()
          )
        ) {
          if (projectToEdit.name.toLowerCase() === 'onboarding') {
            // Do nothing, word `onboarding` has been white-listed
          } else {
            newErrors = {
              ...newErrors,
              name: `Event name cannot contain the Project Name: '${projectToEdit.name}'`,
            };
          }
        }
        break;

      case 'videoConferenceLink':
        // Required
        if (!vals[key]) {
          newErrors = {
            ...newErrors,
            videoConferenceLink: 'Event link is required',
          };
        }
        if (!validateLink(vals[key])) {
          newErrors = {
            ...newErrors,
            videoConferenceLink: 'Invalid link',
          };
        }
        break;

      default:
        break;
    }
  });
  return Object.keys(newErrors).length ? newErrors : null;
};

export default validateEventForm;

function validateLink(str) {
  return validator.isURL(str);
}
