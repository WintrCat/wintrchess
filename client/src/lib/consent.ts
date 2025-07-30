export function removeDefaultConsentLink() {
    const observer = new MutationObserver(() => (
        document.querySelector(
            "div[style^=\"color-scheme: initial\"]"
            + "[style$=\"z-index: initial !important;\"]"
        )?.remove()
    ));

    observer.observe(document.body, { childList: true });
}

export function manageDataConsent() {
    try {
        window.googlefc.callbackQueue.push(
            window.googlefc.showRevocationMessage
        );
    } catch {
        console.warn("failed to display consent management dialog.");
    }
}