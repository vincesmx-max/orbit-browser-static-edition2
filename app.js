const $ = (id) => document.getElementById(id);
const safeUrl = (raw) => {
  const value = raw.trim();
  if (!value) return null;
  if (/^(https?:\/\/)/i.test(value)) {
    try { const u = new URL(value); return ["http:","https:"].includes(u.protocol) ? u.href : null; } catch { return null; }
  }
  if (/^[\w-]+(\.[\w-]+)+([/:?#].*)?$/i.test(value)) return "https://" + value;
  return "https://www.google.com/search?q=" + encodeURIComponent(value);
};
$("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const target = safeUrl($("address").value);
  if (!target) return;
  window.open(target, "_blank", "noopener,noreferrer");
});
const get = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

function renderBookmarks() {
  const list = get("orbitBookmarks", []);
  const host = $("bookmarks");
  host.replaceChildren();
  if (!list.length) { const p=document.createElement("p"); p.className="empty"; p.textContent="Your saved shortcuts will appear here."; host.append(p); return; }
  list.forEach((item, index) => {
    const a=document.createElement("a"); a.className="bookmark"; a.href=item.url; a.target="_blank"; a.rel="noopener noreferrer";
    const name=document.createElement("span"); name.textContent=item.name;
    const del=document.createElement("button"); del.type="button"; del.textContent="×"; del.title="Remove bookmark";
    del.addEventListener("click",(e)=>{e.preventDefault();e.stopPropagation();const next=get("orbitBookmarks",[]);next.splice(index,1);set("orbitBookmarks",next);renderBookmarks();});
    a.append(name,del); host.append(a);
  });
}
$("addBookmark").addEventListener("click",()=> $("bookmarkDialog").showModal());
$("bookmarkForm").addEventListener("submit",(e)=>{
  if(e.submitter?.value!=="save") return;
  e.preventDefault();
  const name=$("siteName").value.trim(), url=safeUrl($("siteUrl").value);
  if(!name || !url || !/^https?:\/\//.test(url)) return;
  const list=get("orbitBookmarks",[]); list.push({name,url}); set("orbitBookmarks",list);
  $("bookmarkDialog").close(); $("bookmarkForm").reset(); renderBookmarks();
});
function refreshProfile(){const name=get("orbitName","Guest");$("profileBtn").textContent=name;}
$("profileBtn").addEventListener("click",()=>{$("displayName").value=get("orbitName","");$("profileDialog").showModal();});
$("profileForm").addEventListener("submit",(e)=>{
  if(e.submitter?.value!=="save") return;
  e.preventDefault(); const name=$("displayName").value.trim() || "Guest";
  set("orbitName",name); refreshProfile(); $("profileDialog").close();
});
$("themeBtn").addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.setItem("orbitTheme",document.body.classList.contains("light")?"light":"dark");});
if(localStorage.getItem("orbitTheme")==="light") document.body.classList.add("light");
refreshProfile(); renderBookmarks();
