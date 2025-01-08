import { generateCsrfToken, generateCsrfHeaders, removeCsrfToken } from '../js/csrf_protection.js';

// Generate and double-submit a CSRF token in a form field and a cookie, as defined by Symfony's SameOriginCsrfTokenManager
document.addEventListener('submit', function (event) {
    generateCsrfToken(event.target);
}, true);

// When @hotwired/turbo handles form submissions, send the CSRF token in a header in addition to a cookie
// The `framework.csrf_protection.check_header` config option needs to be enabled for the header to be checked
document.addEventListener('turbo:submit-start', function (event) {
    Object.entries(generateCsrfHeaders(event.detail.formSubmission.formElement)).forEach(([name, value]) => {
        event.detail.formSubmission.fetchRequest.headers[name] = value;
    });
});

// When @hotwired/turbo handles form submissions, remove the CSRF cookie once a form has been submitted
document.addEventListener('turbo:submit-end', function (event) {
    removeCsrfToken(event.detail.formSubmission.formElement);
});

/* stimulusFetch: 'lazy' */
export default 'csrf-protection-controller';
