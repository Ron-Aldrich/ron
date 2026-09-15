// Role captions, styled like closed-caption subtitles rather than a plain span.
if (window.Typed) {
    new Typed(".typed", {
        strings: ["Short-Film Editor", "Web Developer", "Python Coder", "Videographer", "Freelancer"],
        typeSpeed: 55,
        backSpeed: 30,
        backDelay: 1400,
        loop: true,
        showCursor: false
    });
}

// Top rail: converts scroll position into a fake editing timecode (HH:MM:SS:FF)
// and moves the playhead along the scrub track.
(function () {
    const tcEl = document.getElementById("scrubTC");
    const playhead = document.getElementById("playhead");
    const track = document.querySelector(".rail__track");
    if (!tcEl || !playhead || !track) return;

    const FPS = 24;

    function format(totalFrames) {
        const ff = totalFrames % FPS;
        let totalSeconds = Math.floor(totalFrames / FPS);
        const ss = totalSeconds % 60;
        totalSeconds = Math.floor(totalSeconds / 60);
        const mm = totalSeconds % 60;
        const hh = Math.floor(totalSeconds / 60);
        const pad = (n) => String(n).padStart(2, "0");
        return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
    }

    function update() {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

        // Map the whole page to a nominal 90-second "runtime" for a plausible-looking timecode.
        const totalFrames = Math.round(progress * 90 * FPS);
        tcEl.textContent = format(totalFrames);

        const trackWidth = track.clientWidth;
        playhead.style.left = `${progress * trackWidth}px`;
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
})();

// Broken-image safety net: if a photo 404s or fails to decode, swap it for a
// styled placeholder instead of the browser's default broken-image icon so
// the layout and aspect ratio never break.
(function () {
    function handleError(img) {
        if (img.dataset.fallbackApplied) return;
        img.dataset.fallbackApplied = "true";
        img.style.objectFit = "cover";
        img.style.background = "linear-gradient(135deg, #19191c, #232327)";
        img.alt = img.alt || "Image unavailable";
        const wrap = img.closest(".reel__thumb, .broll__thumb, .hero__frame-inner");
        if (wrap) wrap.classList.add("thumb--broken");
    }

    document.querySelectorAll("img").forEach((img) => {
        if (img.complete && img.naturalWidth === 0) {
            handleError(img);
        }
        img.addEventListener("error", () => handleError(img));
    });
})();


(function () {
    const openBtn = document.getElementById("certOpen");
    const closeBtn = document.getElementById("certClose");
    const modal = document.getElementById("certModal");
    if (!openBtn || !closeBtn || !modal) return;

    function open() {
        modal.classList.add("is-open");
        closeBtn.focus();
    }
    function close() {
        modal.classList.remove("is-open");
        openBtn.focus();
    }

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
})();
(function () {
    const certImg = document.getElementById("certImg");
    const certModal = document.getElementById("certModal");
    const certClose = document.getElementById("certClose");
    if (!certImg || !certModal || !certClose) return;

    function openCertModal() {
        certModal.style.display = "flex";
    }
    function closeCertModal() {
        certModal.style.display = "none";
    }

    certImg.addEventListener("click", openCertModal);
    certClose.addEventListener("click", closeCertModal);

    certModal.addEventListener("click", (e) => {
        if (e.target === certModal) closeCertModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && certModal.style.display === "flex") {
            closeCertModal();
        }
    });
})();