// quote.js (nieuw bestand in ./src/)
import createElement from '../framework/element.js';

/**
 * Component voor het weergeven van een quotepost.
 */
export const QuoteComponent = (props) => {
    return createElement('div', {
        className: 'post quote-post',
        key: props.key
    },
        createElement('p', {}, `"${props.quote || ''}"`),
        createElement('small', {}, `— ${props.author || 'Anoniem'}`)
    );
};