import React from "react"
import classNames from "classnames"

const margin = (start, end) => {
    return [...Array(end).keys()].map((num) => num + start);
}

const PageItem = ({ page, currentPage, onPageClick }) => {
    const itemList = classNames({
        'page-item': true,
        active: page === currentPage
    });

    return (
        <li className={itemList} onClick={() => { onPageClick(page) }} >
            <span className="page-link">{page}</span>
        </li>
    );
}

const Pagination = ({ currentPage, max, limit, onPageClick }) => {
    const count = Math.ceil(max / limit)
    const pages = margin(1, count);

    return (
        <ul className="pagination" style={{
            overflow: "scroll",
        }}>
            {pages.map((page) => (
                <PageItem
                    page={page}
                    key={page}
                    currentPage={currentPage}
                    onPageClick={onPageClick}
                />
            ))}
        </ul>
    );
};

export default Pagination