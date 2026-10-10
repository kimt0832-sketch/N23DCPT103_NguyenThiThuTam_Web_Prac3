'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Product {
    id: number;
    name: string;
    price: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const fetchProducts = async () => {
        try {
            const res = await api.get('/api/products'); // Dùng axios lấy danh sách[cite: 14]
            setProducts(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Không thể tải danh sách sản phẩm!');
        }
    };

    useEffect(() => { 
        fetchProducts(); 
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        // Chỉ gọi api.post duy nhất 1 lần ở đây
        await api.post('/api/products', { name, price: Number(price) });
        
        // Load lại danh sách sản phẩm mới
        fetchProducts();
        
        // Xoá trắng form sau khi thêm thành công
        setName('');
        setPrice('');
        
        toast.success('Thêm sản phẩm thành công!');
    } catch (err: any) {
        console.error(err.response?.data?.error);
        toast.error('Thêm thất bại, vui lòng thử lại!');
    }
};

    // Thêm chức năng Xoá sản phẩm (Optimistic Update)[cite: 17]
    const handleDelete = async (id: number) => {
        if (!confirm('Bạn chắc chắn muốn xoá sản phẩm này?')) return;
        try {
            await api.delete(`/api/products/${id}`);
            // Cập nhật state ngay lập tức không cần F5
            setProducts(prev => prev.filter(p => p.id !== id));
            toast.success('Đã xoá sản phẩm');
        } catch (err) {
            toast.error('Xoá thất bại, thử lại!');
            fetchProducts();
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Quản lý Sản phẩm</h1>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
                <input 
                    className="border p-2 rounded"
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Tên SP" 
                />
                <input 
                    className="border p-2 rounded"
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    placeholder="Giá" 
                    type="number" 
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Thêm sản phẩm
                </button>
            </form>

            <div className="flex flex-col gap-2">
                {products.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 border rounded shadow-sm">
                        <span>
                            <strong>{p.name}</strong> - {p.price.toLocaleString()} đ
                        </span>
                        <button 
                            onClick={() => handleDelete(p.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                            Xoá
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}