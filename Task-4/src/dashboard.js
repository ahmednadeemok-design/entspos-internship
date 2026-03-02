import { getUsers, getPosts, getCommentsByPostId } from "./api.js";
import { ValidationError } from "./errors.js";

/**
 * Fetch users and posts in parallel using Promise.allSettled
 */
export async function loadBaseData() {
  const results = await Promise.allSettled([getUsers(), getPosts()]);

  const usersRes = results[0];
  const postsRes = results[1];

  if (usersRes.status === "rejected") {
    throw usersRes.reason;
  }
  if (postsRes.status === "rejected") {
    throw postsRes.reason;
  }

  return { users: usersRes.value, posts: postsRes.value };
}

/**
 * Promise chaining for nested data:
 * - Find user
 * - Find their posts
 * - For first N posts, fetch comments
 */
export function buildUserDeepView({ users, posts }, userId, takePosts = 3) {
  if (typeof userId !== "number") {
    throw new ValidationError("userId must be a number");
  }

  const user = users.find((u) => u.id === userId);
  if (!user) throw new ValidationError("User not found: " + userId);

  const userPosts = posts.filter((p) => p.userId === userId).slice(0, takePosts);

  // nested promise chain
  return Promise.resolve(userPosts)
    .then((ps) => {
      // fetch comments for each post using allSettled
      const promises = ps.map((p) => getCommentsByPostId(p.id));
      return Promise.allSettled(promises).then((commentResults) => {
        const postsWithComments = ps.map((p, idx) => {
          const r = commentResults[idx];
          return {
            ...p,
            comments: r.status === "fulfilled" ? r.value : [],
            commentsError: r.status === "rejected" ? String(r.reason?.message || r.reason) : null,
          };
        });

        return { user, posts: postsWithComments };
      });
    });
}