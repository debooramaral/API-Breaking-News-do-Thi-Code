import { createService, findAllService, countNews, topNewsService, findByIdService, searchByTitleService, byUserService, updateService, eraseService, likeNewsService, deleteLikeNewsService, addCommentService, deleteCommentService } from "../services/news.service.js";

export const create = async (req, res) => {
    try {
        const { title, text, banner } = req.body;

        if (!title || !banner || !text) {
            res.status(400).send({
                message: "Envie todos os campos para cadastro",
            });
        }

        await createService({
            title,
            text,
            banner,
            user: req.userId,
        })

        res.send(201);
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

export const findAll = async (req, res) => {
    try {
        let { limit, offset } = req.query;

        limit = Number(limit);
        offset = Number(offset);

        if (!limit) {
            limit = 5;
        }

        if (!offset) {
            offset = 0;
        }

        const news = await findAllService(offset, limit);
        const total = await countNews();
        const currentUrl = req.baseUrl;

        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

        if (news.length === 0) {
            return res.status(400).send({
                message: "Não existe registro de noticias"
            });
        }
        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,

            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                //adapatação do código devido a um erro na execução, 500 banco de dados e indefinido na variavel de usuario
                name: item.user ? item.user.name : null,
                username: item.user ? item.user.username : null,
                userAvatar: item.user ? item.user.avatar : null,
            })),
        });

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

export const topNews = async (req, res) => {
    try {
        const news = await topNewsService();

        if (!news) {
            return res.status(400).send({ message: "Não há postagem registrada" });
        }

        res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                username: news.user.username,
                userAvatar: news.user.avatar,
            }

        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

export const findById = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await findByIdService(id)
        return res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                username: news.user.username,
                userAvatar: news.user.avatar,
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query; //query string

        const news = await searchByTitleService(title);

        if (news.length === 0) {
            return res.status(400).send({ message: "Não existe nenhuma news com este titulo" });
        }

        return res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                //adapatação do código devido a um erro na execução, 500 banco de dados e indefinido na variavel de usuario
                name: item.user ? item.user.name : null,
                username: item.user ? item.user.username : null,
                userAvatar: item.user ? item.user.avatar : null,
            })),
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const byUser = async (req, res) => {
    try {
        const id = req.userId;
        const news = await byUserService(id);

        return res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                //adapatação do código devido a um erro na execução, 500 banco de dados e indefinido na variavel de usuario
                name: item.user ? item.user.name : null,
                username: item.user ? item.user.username : null,
                userAvatar: item.user ? item.user.avatar : null,
            })),
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const update = async (req, res) => {
    try {
        const { title, text, banner } = req.body;
        const { id } = req.params;

        if (!title && !banner && !text) {
            res.status(400).send({
                message: "Envie pelo menos um campo para atualizar a noticia"
            });
        }

        const news = await findByIdService(id);

        /*console.log(typeof news.user._id, typeof req.userId)*/

        if (String(news.user._id) != req.userId) {
            return res.status(400).send({
                message: "Você não pode atualizar esta noticia",
            });
        }

        await updateService(id, title, text, banner);

        return res.send({ message: "Noticia atualizada com sucesso!" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const erase = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await findByIdService(id);

        if (String(news.user._id) != req.userId) { //detalhe que foi o unico jeito de funcionar
            return res.status(400).send({
                message: "Você não pode excluir esta noticia",
            });
        }

        await eraseService(id);

        return res.send({ message: "Noticia excluida com sucesso" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const likeNews = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const newsLiked = await likeNewsService(id, userId);

        // console.log(newsLiked);

        if (!newsLiked) {
            await deleteLikeNewsService(id, userId);
            return res.status(200).send({ message: "Like removido com sucesso !" })
        }

        res.send({ message: "Like feito com sucesso" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).send({ message: "Escreva uma mensagem para comentar" });
        }

        await addCommentService(id, comment, userId);

        res.send({
            message: "Comentario adicionado com Sucesso!"
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { idNews, idComment } = req.params;
        const userId = req.userId;

        const commentDelete = await deleteCommentService(idNews, idComment, userId);

        if(commentDelete.comments.userId !== userId){
            return res.status(400).send({message: "Você não pode remover este comentario"})
        }

        //variação do código para filtrar array de comments

        /*
        
        const commentFinder = commentDelete.comments.find((comment) => comment.idComment === idComment);

        // se não tiver ou não localizar o comentario 

        if(!= commentFinder) {
            return res.status(404).send({message: "O comentario não existe"});
        }

        // filtro do array de comments

        if(commentFinder.userId !== userId) {
            return res.status(400).send({message: "Você não pode remover este comentario"})
        }
        
        */

        res.send({
            message: "Comentario removido com Sucesso!"
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};