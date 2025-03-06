import React, { useEffect, useState } from "react";
import { Button, IconButton, Box } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";

const AccessibilityToolbar = ({ customStyle }) => {
  const [expanded, setExpanded] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  // Dynamically update the global font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // Override Google Translate banner functions and remove banner iframe if it appears
  useEffect(() => {
    const overrideGoogleTranslateBanner = () => {
      if (
        window.google &&
        window.google.translate &&
        window.google.translate.TranslateElement
      ) {
        // Override the function that shows the banner
        window.google.translate.TranslateElement.prototype.showBanner = function() {};
      }
    };

    // Check every 100ms until the Google Translate script is loaded
    const intervalId = setInterval(() => {
      if (
        window.google &&
        window.google.translate &&
        window.google.translate.TranslateElement
      ) {
        overrideGoogleTranslateBanner();
        clearInterval(intervalId);
      }
    }, 100);

    // Use MutationObserver to remove the banner iframe if it is injected into the DOM
    const observer = new MutationObserver(() => {
      const bannerFrame = document.querySelector("iframe.goog-te-banner-frame");
      if (bannerFrame) {
        bannerFrame.parentNode.removeChild(bannerFrame);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, []);

  // Load the Google Translate widget script on mount
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false, // prevent the banner from auto-displaying
        },
        "google_translate_element"
      );
    };

    if (
      !document.querySelector(
        "script[src='//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit']"
      )
    ) {
      addGoogleTranslateScript();
    }
  }, []);

  // Helper function to set a cookie
  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  // Language switch using Google Translate cookie
  const handleTranslate = (targetLang) => {
    setCookie("googtrans", `/en/${targetLang}`, 1);
    window.location.reload();
  };

  const increaseFontSize = () => setFontSize((prev) => prev + 1);
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 1, 12));

  // Default fixed style for the toolbar (bottom-right)
  const defaultStyle = {
    position: "fixed",
    bottom: 16,
    right: 16,
  };

  return (
    <>
      {/* Inline CSS as a fallback to hide any residual Google Translate banner */}
      <style>
        {`
          .goog-te-banner-frame.skiptranslate {
            display: none !important;
          }
          body {
            top: 0px !important;
          }
        `}
      </style>

      <Box
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        sx={{
          ...defaultStyle,
          ...customStyle,
          borderRadius: expanded ? "50px" : "50%",
          backgroundColor: "background.paper",
          boxShadow: 3,
          display: "flex",
          alignItems: "center",
          gap: expanded ? 1 : 0,
          p: expanded ? 0.5 : 0,
          width: expanded ? "auto" : "40px",
          height: expanded ? "auto" : "40px",
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          zIndex: 1300,
          "@media print": { display: "none" },
        }}
      >
        {/* Hidden element required for the Google Translate widget */}
        <Box id="google_translate_element" sx={{ display: "none" }} />

        {!expanded && (
          <IconButton size="small" sx={{ p: 1 }}>
            <AccessibilityNewIcon fontSize="medium" />
          </IconButton>
        )}

        {expanded && (
          <>
            <IconButton size="small" sx={{ p: 0.5 }}>
              <AccessibilityNewIcon fontSize="small" />
            </IconButton>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleTranslate("hi")}
              sx={{ borderRadius: "50px", textTransform: "none", px: 1.5 }}
            >
              हिंदी
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleTranslate("en")}
              sx={{ borderRadius: "50px", textTransform: "none", px: 1.5 }}
            >
              EN
            </Button>
            <IconButton onClick={decreaseFontSize} size="small">
              <ZoomOutIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={increaseFontSize} size="small">
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>
    </>
  );
};

export default AccessibilityToolbar;
