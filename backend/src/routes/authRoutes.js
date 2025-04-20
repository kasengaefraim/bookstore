import express from "express";
const router = express.Router();

router.post("/register", async (req,res) =>{
try {
    res.send("register");
} catch (error) {
    
}
});
router.post("/login", async(req,res) =>{
res.send("login");
});

export default router;