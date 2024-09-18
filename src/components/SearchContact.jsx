import React, { useState, useEffect, useRef } from 'react';
import styles from '../css/SearchContact.module.css';
import CreateContact from './CreateContact';



const DropdownWithSearch = () => {
    const [contacts, setContacts] = useState([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Bob Johnson' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showCreateContact, setShowCreateContact] = useState(false);
    const dropdownRef = useRef(null);

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (contact) => {
        setSelectedContact(contact);
        setSearchTerm(contact.name);
        setShowDropdown(false);
    };

    const handleCreateContact = () => {
        setShowCreateContact(true)
        console.log('Create new contact');
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowDropdown(value.length > 0);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className={styles.dropdownContainer} ref={dropdownRef}>
                <h1>Please select a contact</h1>
                <input
                    type="text"
                    value={searchTerm}
                    onFocus={() => setShowDropdown(searchTerm.length > 0)}
                    onChange={handleInputChange}
                    placeholder="Search for contact"
                    className={styles.searchInput}
                />
                {showDropdown && (
                    <div className={styles.dropdown}>
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className={styles.dropdownItem}
                                    onClick={() => handleSelect(contact)}
                                >
                                    {contact.name}
                                </div>
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                No contact found.
                                <button className={styles.createButton} onClick={handleCreateContact}>
                                    Create Contact
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showCreateContact && <CreateContact />}

        </>
    );
};

export default DropdownWithSearch;


