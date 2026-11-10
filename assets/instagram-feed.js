/**
 * Press By Heart - Real Live Instagram Feed Loader
 * Supports:
 * 1. Meta / Instagram Basic Display API (Access Token)
 * 2. Behold.so / Curator / JSON Feed API URL
 * 3. Graceful fallback cards if no connection is active
 */
(function() {
  'use strict';

  function initFeed(section) {
    var container = section ? section.querySelector('.social-grid[data-instagram-grid]') : document.querySelector('.social-grid[data-instagram-grid]');
    if (!container) return;

    var token = (container.getAttribute('data-access-token') || '').trim();
    var feedUrl = (container.getAttribute('data-feed-url') || '').trim();
    var limit = parseInt(container.getAttribute('data-post-limit') || '6', 10);
    var handle = container.getAttribute('data-handle') || '@PRESSBYHEART';
    var defaultUrl = container.getAttribute('data-account-url') || 'https://www.instagram.com/pressbyheart/';

    // If neither token nor custom feed URL is configured, retain default fallback/demo cards
    if (!token && !feedUrl) {
      return;
    }

    var requestUrl = '';
    var isGraphApi = false;

    if (feedUrl) {
      requestUrl = feedUrl;
    } else if (token) {
      isGraphApi = true;
      requestUrl = 'https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&limit=' + limit + '&access_token=' + encodeURIComponent(token);
    }

    // Cache check (15 minutes TTL) to prevent hitting Instagram rate limits
    var cacheKey = 'pbh_ig_feed_' + (feedUrl ? btoa(feedUrl).slice(0, 16) : token.slice(-10)) + '_' + limit;
    try {
      var cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        var parsed = JSON.parse(cached);
        if (parsed && parsed.timestamp && (Date.now() - parsed.timestamp < 15 * 60 * 1000) && parsed.posts && parsed.posts.length > 0) {
          renderInstagramPosts(container, parsed.posts, handle, defaultUrl);
          return;
        }
      }
    } catch (e) {
      // Ignore storage errors
    }

    fetch(requestUrl)
      .then(function(res) {
        if (!res.ok) {
          throw new Error('Instagram Feed request failed with HTTP status ' + res.status);
        }
        return res.json();
      })
      .then(function(data) {
        var posts = [];
        if (Array.isArray(data)) {
          posts = data;
        } else if (data && Array.isArray(data.data)) {
          posts = data.data;
        } else if (data && Array.isArray(data.posts)) {
          posts = data.posts;
        }

        if (posts && posts.length > 0) {
          var sliced = posts.slice(0, limit);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({
              timestamp: Date.now(),
              posts: sliced
            }));
          } catch(e) {}
          renderInstagramPosts(container, sliced, handle, defaultUrl);
        }
      })
      .catch(function(err) {
        console.warn('[Press By Heart Instagram Feed] Notice:', err.message, '- Displaying fallback posts.');
      });
  }

  function renderInstagramPosts(container, posts, handle, defaultUrl) {
    if (!container || !posts || !posts.length) return;

    // Clear existing fallback cards
    container.innerHTML = '';

    posts.forEach(function(post) {
      var isVideo = (post.media_type === 'VIDEO' || post.mediaType === 'VIDEO');
      var imgUrl = isVideo 
        ? (post.thumbnail_url || post.thumbnailUrl || post.media_url || post.mediaUrl) 
        : (post.media_url || post.mediaUrl || post.thumbnail_url || post.thumbnailUrl);
      var permalink = post.permalink || post.url || defaultUrl;
      var caption = post.caption || ('Post by ' + handle);
      var safeCaption = escapeHtml(caption);
      var shortCaption = caption.length > 70 ? caption.slice(0, 67) + '...' : caption;

      if (!imgUrl) return;

      var card = document.createElement('a');
      card.className = 'instagram-card live-instagram-card';
      card.setAttribute('role', 'listitem');
      card.setAttribute('href', permalink);
      card.setAttribute('target', '_blank');
      card.setAttribute('rel', 'noopener noreferrer');
      card.setAttribute('aria-label', safeCaption + ' — view on Instagram');

      var videoBadgeHtml = isVideo 
        ? '<span class="instagram-video-badge" aria-hidden="true" title="Video Post">' +
            '<svg viewBox="0 0 24 24" width="12" height="12" fill="#fff"><path d="M8 5v14l11-7z"/></svg>' +
          '</span>'
        : '';

      card.innerHTML = 
        '<div class="instagram-img-wrap">' +
          '<img src="' + imgUrl + '" alt="' + safeCaption + '" loading="lazy" width="240" height="240">' +
          videoBadgeHtml +
        '</div>' +
        '<span class="instagram-overlay" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7"/></svg>' +
          '<span class="instagram-overlay-caption">' + escapeHtml(shortCaption) + '</span>' +
        '</span>';

      container.appendChild(card);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initFeed();
    });
  } else {
    initFeed();
  }

  // Shopify Theme Editor dynamic events
  document.addEventListener('shopify:section:load', function(event) {
    if (event.target && event.target.querySelector('[data-instagram-grid]')) {
      initFeed(event.target);
    }
  });

  document.addEventListener('shopify:section:select', function(event) {
    if (event.target && event.target.querySelector('[data-instagram-grid]')) {
      initFeed(event.target);
    }
  });
})();
