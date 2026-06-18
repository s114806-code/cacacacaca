import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON request body parsing
  app.use(express.json());

  // API Route - Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // API Route - Retrieve Chef Curated Menu
  app.get("/api/menu", (req, res) => {
    const dishes = [
      {
        id: "d1",
        name: "金牌祕製東坡肉",
        description: "特選肥瘦相間五花肉，承襲古法慢火燉煮六小時，油脂入口即化，醬料濃郁滑順，鹹甜完美交織。",
        price: 380,
        category: "主廚推薦",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop",
        isPopular: true
      },
      {
        id: "d2",
        name: "乾煸四季豆",
        description: "高溫油炸迅速鎖水，佐以豬五花絞肉、特製冬菜與蝦米，大火煸炒香氣四溢，口感爽脆微脆，極度開胃。",
        price: 220,
        category: "精選熱炒",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop",
        isPopular: true
      },
      {
        id: "d3",
        name: "仙翁古法老鴨煲",
        description: "選用足重優良土黑鴨，經4小時高湯細火慢熬，輔以百合、精選筍乾及珍稀金真菇，鮮甜滋潤沁人心脾。",
        price: 580,
        category: "傳奇湯羹",
        image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&auto=format&fit=crop",
        isPopular: true
      },
      {
        id: "d4",
        name: "鮮蟹黃豆腐丸子煲",
        description: "綿密手工嫩豆腐過熱油，浸入新鮮慢熬的黃金蟹黃高湯中燉煮，湯汁金黃，鮮甜濃郁口感細緻滑口。",
        price: 320,
        category: "砂鍋熱煲",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop",
        isPopular: false
      },
      {
        id: "d5",
        name: "金沙蛋黃爆漿流沙包",
        description: "純手工竹篩發酵Q彈香甜麵皮，咬開即湧出溫熱爆漿的金黃熟成鹹蛋黃與優質進口鮮奶油內餡。",
        price: 150,
        category: "精緻點心",
        image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop",
        isPopular: true
      },
      {
        id: "d6",
        name: "東港櫻花蝦御廚炒飯",
        description: "嚴選一等越光米，以猛火與特級雞蛋、櫻花蝦爆炒，粒粒金黃微焦，香脆鮮美並帶著高雅海苔細絲芬芳。",
        price: 260,
        category: "主食御饗",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop",
        isPopular: false
      },
      {
        id: "d7",
        name: "鮮蝦松露翡翠水晶蒸餃",
        description: "薄如蟬翼的澄粉皮晶瑩剔透，包裹著整隻手剝鮮蝦仁與頂級野生黑松露醬，清爽滑彈，頂級奢華享受。",
        price: 280,
        category: "精緻點心",
        image: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=600&auto=format&fit=crop",
        isPopular: true
      },
      {
        id: "d8",
        name: "清蒸鮮露大石斑",
        description: "嚴選每日海運鮮活石斑魚，極鮮清蒸保留鮮美原汁原味，淋上純手釀醬油與燙熱蔥花，肉質細嫩富有彈性。",
        price: 880,
        category: "海鮮美饌",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop",
        isPopular: false
      }
    ];
    res.json(dishes);
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static build assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Restaurant System backend running elegantly on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server failure on startup:", err);
});
