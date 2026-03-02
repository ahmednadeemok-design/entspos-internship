import { loadBaseData, buildUserDeepView } from "./dashboard.js";
import { debounce } from "./debounce.js";
import { throttle } from "./throttle.js";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  try {
    console.log("=== API Data Dashboard (JSONPlaceholder) ===\n");

    // 1) Load base data using async/await + Promise.allSettled
    console.log("Loading users + posts (Promise.allSettled) ...");
    const base = await loadBaseData();
    console.log(`Loaded users=${base.users.length}, posts=${base.posts.length}\n`);

    // 2) Build a nested user view using promise chain (users -> posts -> comments)
    console.log("Building deep view for userId=1 (posts + comments) ...");
    const deep = await buildUserDeepView(base, 1, 3);

    console.log(`User: ${deep.user.name} (${deep.user.email})`);
    for (const p of deep.posts) {
      console.log(`- Post#${p.id}: ${p.title} | comments=${p.comments.length}`);
      if (p.commentsError) console.log("  comments error:", p.commentsError);
    }

    // 3) Debounced search simulation (setTimeout inside debounce)
    console.log("\n=== Debounce Search Simulation ===");
    const doSearch = (text) => {
      const q = text.toLowerCase();
      const matched = base.posts.filter((p) => p.title.toLowerCase().includes(q)).slice(0, 5);
      console.log(`Search executed for "${text}". Top matches:`, matched.map((m) => m.id));
    };

    const debouncedSearch = debounce(doSearch, 400);

    // simulate rapid typing: these should NOT all execute; only the last one executes
    debouncedSearch("ja");
    await sleep(100);
    debouncedSearch("jav");
    await sleep(100);
    debouncedSearch("java");
    await sleep(100);
    debouncedSearch("javascript");
    await sleep(700); // wait enough so final debounce triggers

    // 4) Throttle scroll simulation (infinite load)
    console.log("\n=== Throttle Infinite Scroll Simulation ===");
    let page = 0;
    const pageSize = 10;

    const loadMore = () => {
      page += 1;
      const start = (page - 1) * pageSize;
      const chunk = base.posts.slice(start, start + pageSize);
      console.log(`Loaded page ${page}: postIds`, chunk.map((p) => p.id));
    };

    const throttledLoadMore = throttle(loadMore, 500);

    // simulate many scroll events quickly; throttle makes it run max once per 500ms
    for (let i = 0; i < 12; i++) {
      throttledLoadMore();
      await sleep(120);
    }

    console.log("\nDone.");
  } catch (err) {
    console.log("\n❌ Dashboard Error:");
    console.log(err.name + ":", err.message);
    if (err.status) console.log("HTTP status:", err.status);
  } finally {
    console.log("\n(finally) Cleanup can happen here if needed.");
  }
}

main();