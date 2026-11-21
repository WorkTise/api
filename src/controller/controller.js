let users = [
    {
        id: 1,
        name: "Shafiq",
        email: "shafiq@example.com"
    },
    {
        id: 2,
        name: "Raqib",
        email: "raqib@example.com"
    }
];

// GET all users
exports.getUsers = (req, res) => {
    res.json({
        success: true,
        data: users
    });
};

// GET user by ID
exports.getUser = (req, res) => {
    const user = users.find(
        u => u.id === Number(req.params.id)
    );

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.json({
        success: true,
        data: user
    });
};

// CREATE user
exports.createUser = (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email are required"
        });
    }

    const user = {
        id: users.length
            ? Math.max(...users.map(u => u.id)) + 1
            : 1,
        name,
        email
    };

    users.push(user);

    res.status(201).json({
        success: true,
        data: user
    });
};

// UPDATE user
exports.updateUser = (req, res) => {
    const user = users.find(
        u => u.id === Number(req.params.id)
    );

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const { name, email } = req.body;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;

    res.json({
        success: true,
        data: user
    });
};

// DELETE user
exports.deleteUser = (req, res) => {
    const index = users.findIndex(
        u => u.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    users.splice(index, 1);

    res.json({
        success: true,
        message: "User deleted successfully"
    });
};