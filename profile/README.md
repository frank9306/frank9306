# GitHub 工程终端维护

- `profile.json`：人工维护的公开个人资料；`portrait.txt` / `portrait-dark.txt`：当前 GitHub 头像的浅色／深色字符画（头像来源见配置，2026-11-04 修正）。从原头像取 340×460px 面部裁切，按字符单元宽高补偿后采样为 80×54；通过源图颜色提取主体并抑制原图网格，不使用几何轮廓近似人物。两套明暗映射分别保留墨镜与皮肤的对比。
- `generated/`：四套 SVG 与仅含汇总数字的 `stats.json`。README 通过 `<picture>` 在 1200px 及以下选择竖版，避免 GitHub 侧栏挤压横版文字，并跟随系统深浅主题。没有外部字体、脚本或第三方统计图片依赖。
- 更新入口：为当前进程设置 `GITHUB_TOKEN` 后运行 `npm run profile:update`，或在 GitHub Actions 中手动运行 **Update GitHub profile**。请勿把凭据写进文件或命令日志。
- 只调整头像或排版时：运行 `npm run profile:update -- --render-only`，从已有公开汇总快照重新渲染，无需令牌，不刷新统计或更新时间。
- 定时更新：每天北京时间约 02:23（GitHub 调度可能延迟），也支持手动运行。部署后才会生效；本地实现不会替用户提交、推送或启用云端任务。

## 统计口径

Repos 为本人拥有的全部公开非 fork 仓库，包含已归档仓库；Stars/Forks 为这些仓库对应计数之和。Followers 来自公开用户信息。

Commits、PRs、Reviews 为以本次更新时间结束、向前推 12 个日历月的公开贡献，闰日向前推一年时落在 2 月 28 日。Commit 按 GitHub contribution API 的提交贡献口径（不是所有分支的完整 Git 日志）；PR 和 Review 按对应贡献条目计数。过滤私有仓库、受限贡献，不使用 owner token 可见的总数或 restrictedContributionsCount；不会保存原始活动或私有仓库名。

仓库与 PR/Review 连接完整分页；Commit 以月为单位查询日贡献，检查仓库覆盖和连接截断。单月超过 GitHub 返回的 100 个贡献仓库上限时明确失败，保留上一快照，不发布不完整数字。HTTP、限流、GraphQL 或数据格式错误同样失败，生成成功前不会写入旧资源或更新时间。

## 验证与发布

`npm test -- scripts/profile/generate.test.mjs` 验证生成器公开行为。项目原有检查仍适用。更新工作流仅暂存五个生成资源，使用默认 `GITHUB_TOKEN` 提交；这类提交不会自动触发现有 Pages 的 push 工作流。若仓库保护规则禁止机器人直推，更新任务会失败并保留现有线上版本，应按仓库既有流程处理，不要扩大令牌权限。

参考图仅用于布局分析；SVG 模板和生成逻辑自行编写，未复制参考仓库代码。
