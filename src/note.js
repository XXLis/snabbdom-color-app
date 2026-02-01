// note.js (nieuw bestand in ./src/)
import createElement from '../framework/element.js';

/**
 * Component voor het weergeven van een notitiepost.
 */
export const NoteComponent = (props) => {
    return createElement('div', {
        className: 'post note-post',
        key: props.key
    },
        createElement('h3', {}, props.title || 'Titel'),
        createElement('p', {}, props.content || ''),
        createElement('small', {}, `Door: ${props.author || 'Anoniem'}`)
    );
};