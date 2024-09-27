const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Thêm module path để xử lý đường dẫn
const bodyParser = require('body-parser');
const Tree = require('./models/tree'); // Import mô hình Tree

const app = express();
const port = 3000;

// Kết nối đến MongoDB
mongoose.connect('mongodb://localhost:27017/treeshop')
    .then(() => {
        console.log('Kết nối đến MongoDB thành công');
    })
    .catch(err => {
        console.error('Kết nối đến MongoDB thất bại:', err);
    });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Đường dẫn tới views
app.set('views', path.join(__dirname, 'views'));

// Trang chính - hiển thị danh sách cây
app.get('/', async (req, res) => {
    const trees = await Tree.find();
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API để thêm, xóa, cập nhật cây
app.post('/add-tree', async (req, res) => {
    const { name, description, image } = req.body;
    const newTree = new Tree({ name, description, image });
    await newTree.save();
    res.redirect('/');
});

app.post('/delete-tree/:id', async (req, res) => {
    await Tree.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.post('/update-tree/:id', async (req, res) => {
    const { name, description, image } = req.body;
    await Tree.findByIdAndUpdate(req.params.id, { name, description, image });
    res.redirect('/');
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
