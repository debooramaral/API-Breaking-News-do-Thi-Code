import userService from "../services/user.service.js";

const create = async (req, res) => {
    try {
        const { name, username, email, password, avatar, background } = req.body;

        //determine o status code necessario e aplique um erro, neste caso é de falta de preenchimento dos campos

        if (!name || !username || !password || !avatar || !background) { //se eu não tiver ! e ou ||
            res.status(400).send({ message: "envie todos os campos para registro" })
        }

        const user = await userService.createService(req.body);

        if (!user) {
            return res.status(400).send({ message: "Erro na criação do Usuário" });
        }

        // res.json("OK")

        res.status(201).send({
            message: "Usuário criado com sucesso",
            user: {
                id: user._id,
                name,
                username,
                email,
                avatar,
                background,
            },
        });
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

const findAll = async (req, res) => {
    try {
        const users = await userService.findAllService(); // observar qe este findAll é do userService, não é o mesmo da função

        if (users.length === 0) {
            return res.status(400).send({ message: "Não existe usuários registrados" })
        }

        res.send(users)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

const findById = async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

const update = async (req, res) => {
    try {
        const { name, username, email, password, avatar, background } = req.body;

        if (!name && !username && !password && !avatar && !background) { //se eu não tiver ! e E &&
            res.status(400).send({ message: "submeta ao menos um campo para fazer a atualização" })
        }

        const { id, user } = req;

        await userService.updateService(
            id,
            name,
            username,
            email,
            password,
            avatar,
            background
        );

        res.send({ message: "usuário foi atualizado com sucesso!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

export default { create, findAll, findById, update };

// uma vez que se cria uma logica, caso queira utilizar em outro local, use o exports para depois importar em outro local
